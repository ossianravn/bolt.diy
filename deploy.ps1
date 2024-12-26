# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..." -ForegroundColor Green

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Install all dependencies (including dev dependencies for build)
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
pnpm run build

# Clean dev dependencies and install only production dependencies
Write-Host "Installing production dependencies..." -ForegroundColor Yellow
pnpm install --prod --prefer-offline

# Set production environment
$env:NODE_ENV = "production"

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
node server.js 