import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET, PREFIX, s3 } from "../config/s3.js";

// Turn "My Photo (1).PNG" into "my-photo-1.png" so the S3 key is clean
function safeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Only keys inside our uploads/ folder can be read or deleted
function checkKey(key) {
  return typeof key === "string" && key.startsWith(PREFIX) && !key.includes("..");
}

// POST /api/files  (form field name: "file")
export async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Choose a file first." });
  }

  const key = `${PREFIX}${Date.now()}-${safeFileName(req.file.originalname)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    })
  );

  res.status(201).json({ key, size: req.file.size, type: req.file.mimetype });
}

// GET /api/files
export async function listFiles(req, res) {
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX }));
  const files = (result.Contents || []).map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
  }));
  res.json(files);
}

// GET /api/files/url?key=uploads/...
// The bucket stays private: the browser gets a link that works for 5 minutes.
export async function getFileUrl(req, res) {
  const { key } = req.query;
  if (!checkKey(key)) {
    return res.status(400).json({ error: "Invalid key." });
  }

  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: 300,
  });
  res.json({ url });
}

// DELETE /api/files?key=uploads/...
export async function deleteFile(req, res) {
  const { key } = req.query;
  if (!checkKey(key)) {
    return res.status(400).json({ error: "Invalid key." });
  }

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  res.status(204).end();
}
