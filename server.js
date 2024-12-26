import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequestHandler } from "@remix-run/node";
import * as build from "./build/server/index.js";

const handler = createRequestHandler(build, process.env.NODE_ENV);

const port = process.env.PORT || 3000;
createServer(async (req, res) => {
  if (req.url.startsWith("/build/")) {
    // Serve static files from build directory
    const filePath = new URL("." + req.url, import.meta.url);
    const content = await readFile(filePath);
    return res.writeHead(200).end(content);
  }
  
  return handler(req, res);
}).listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 