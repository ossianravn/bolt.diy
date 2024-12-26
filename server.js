import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure critical environment variables are set
const requiredEnvVars = {
  SESSION_SECRET: "bolt-diy-session-secret-key-2024",
  NODE_ENV: "production",
  PORT: "3000",
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "admin123"
};

// Set any missing environment variables
Object.entries(requiredEnvVars).forEach(([key, defaultValue]) => {
  if (!process.env[key]) {
    process.env[key] = defaultValue;
    console.log(`Setting default value for ${key}`);
  }
});

const BUILD_PATH = "./build/server/index.js";
const VERSION_PATH = "./build/version.txt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static("public"));

// Serve static files from the build/client directory
app.use(express.static("build/client"));

// Create an async function to handle the server setup
async function startServer() {
  const build = await import(BUILD_PATH);

  app.all(
    "*",
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    })
  );

  const port = process.env.PORT;
  app.listen(port, async () => {
    console.log(`Express server listening on port ${port}`);

    if (process.env.NODE_ENV === "development") {
      broadcastDevReady(build);
    }
  });
}

// Start the server
startServer().catch(console.error); 