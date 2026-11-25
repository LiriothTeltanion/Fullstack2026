import { S3Client } from "@aws-sdk/client-s3";

// The client reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from the
// environment by itself, so no keys are written in the code.
export const s3 = new S3Client({ region: process.env.AWS_REGION });

export const BUCKET = process.env.S3_BUCKET;

// Every upload goes under this folder inside the bucket
export const PREFIX = "uploads/";
