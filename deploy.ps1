# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..." -ForegroundColor Green

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Temporarily unset NODE_ENV to install all dependencies
Remove-Item Env:\NODE_ENV -ErrorAction SilentlyContinue
Write-Host "Installing all dependencies..." -ForegroundColor Yellow
pnpm install

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
pnpm exec remix vite:build

# Install only production dependencies
Write-Host "Installing production dependencies..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
pnpm install --prod --prefer-offline

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
node server.js 