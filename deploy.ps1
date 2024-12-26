# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..."

Write-Host "Installing all dependencies (including dev dependencies)..."
[Environment]::SetEnvironmentVariable("NODE_ENV", "development", [System.EnvironmentVariableTarget]::Process)
pnpm install

Write-Host "Building application..."
pnpm exec remix vite:build

Write-Host "Installing production dependencies..."
[Environment]::SetEnvironmentVariable("NODE_ENV", "production", [System.EnvironmentVariableTarget]::Process)
pnpm install --prod --prefer-offline

Write-Host "Starting server..."
node server.js 