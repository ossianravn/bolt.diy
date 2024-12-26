# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..." -ForegroundColor Green

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install --prod

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
pnpm run build

# Set production environment
$env:NODE_ENV = "production"

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
node server.js 