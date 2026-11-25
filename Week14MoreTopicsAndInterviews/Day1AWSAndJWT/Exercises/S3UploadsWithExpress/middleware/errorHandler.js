import multer from "multer";

// Express knows this is an error handler because it takes four arguments.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "The file is bigger than 5 MB."
        : "Only JPG, PNG, WebP, GIF or PDF files are allowed.";
    return res.status(400).json({ error: message });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong talking to S3." });
}
