import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES modules fix for __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Install Remix globals
installGlobals();

const app = express();

// Serve static files from the build/client directory
app.use(express.static(path.join(__dirname, 'build', 'client')));

// All other routes will be handled by Remix
app.all(
  '*',
  createRequestHandler({
    build: await import('./build/server/index.js'),
    mode: process.env.NODE_ENV || 'production',
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 