// Only lets the request through when the x-api-key header matches API_KEY.
export default function checkApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected || req.get("x-api-key") !== expected) {
    return res.status(401).json({ error: "Missing or wrong x-api-key header" });
  }
  next();
}
