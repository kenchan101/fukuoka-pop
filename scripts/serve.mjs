import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const root = path.resolve(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    let info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      info = await stat(filePath).catch(() => null);
    }
    if (!info) {
      filePath = path.join(root, "index.html");
      info = await stat(filePath);
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=60",
      "Service-Worker-Allowed": "/",
    };
    res.writeHead(200, headers);
    res.end(await readFile(filePath));
  } catch (err) {
    res.writeHead(500);
    res.end("Server error");
    console.error(err);
  }
});

server.listen(port, "0.0.0.0", () => {
  const nets = os.networkInterfaces();
  const addresses = [];
  for (const list of Object.values(nets)) {
    for (const net of list || []) {
      if (net.family === "IPv4" && !net.internal) addresses.push(net.address);
    }
  }
  console.log(`\n  FUKUOKA POP! running at:`);
  console.log(`  http://localhost:${port}`);
  addresses.forEach((a) => console.log(`  http://${a}:${port}  (same Wi-Fi)`));
  console.log("  Press Ctrl+C to stop.\n");
});
