// Exercise 4: read an HTML file from disk and send it
import http from "node:http";
import { readFile } from "node:fs/promises";

const PORT = Number(process.env.PORT) || 3003;
const PAGE = new URL("./public/index.html", import.meta.url);

const server = http.createServer(async (req, res) => {
  try {
    // Read on every request, so editing the HTML shows up without a restart
    const html = await readFile(PAGE, "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (error) {
    console.error("Could not read the page:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error: the page file is missing");
  }
});

server.listen(PORT, () => console.log(`Exercise 4 on http://localhost:${PORT}`));
