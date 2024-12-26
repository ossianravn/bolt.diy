# Build the application
pnpm run build

# Create deployment package directory
$packageDir = ".\deployment-package"
if (Test-Path -Path $packageDir) {
    Remove-Item -Path $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $packageDir
New-Item -ItemType Directory -Path "$packageDir\build"
New-Item -ItemType Directory -Path "$packageDir\build\client"
New-Item -ItemType Directory -Path "$packageDir\build\server"

# Copy build files
Get-ChildItem -Path ".\build\client" | Copy-Item -Destination "$packageDir\build\client" -Recurse
Get-ChildItem -Path ".\build\server" | Copy-Item -Destination "$packageDir\build\server" -Recurse
Copy-Item -Path ".\web.config" -Destination $packageDir
Copy-Item -Path ".\package.json" -Destination $packageDir
Copy-Item -Path ".\pnpm-lock.yaml" -Destination $packageDir

# Create a README for deployment
@"
Deployment Instructions:
1. In IIS Manager, stop the bolt.engineer website
2. Install Node.js on the server if not already installed
3. Install pnpm globally: npm install -g pnpm
4. Copy these files to C:\Websites\bolt.engineer
5. Run 'pnpm install --prod' in the deployment directory
6. In IIS Manager:
   - Ensure URL Rewrite module is installed
   - Start the bolt.engineer website
"@ | Out-File -FilePath "$packageDir\DEPLOY.txt"

Write-Host "Deployment package created in $packageDir"
Write-Host "Transfer this directory to your server and follow instructions in DEPLOY.txt" 