param(
    [Parameter(Mandatory=$true)]
    [string]$Environment
)

if (-not $Environment) {
    Write-Host "Usage: .\deploy.ps1 <environment>"
    Write-Host "Example: .\deploy.ps1 production"
    exit 1
}

Write-Host "Deploying frontend to $Environment environment..."

# Build the Docker image
Write-Host "Building Docker image..."
docker build -t nopcommerce-frontend:latest .

# Stop existing container if running
Write-Host "Stopping existing container..."
docker stop nopcommerce-frontend 2>$null
docker rm nopcommerce-frontend 2>$null

# Run new container
Write-Host "Starting new container..."
docker run -d `
    --name nopcommerce-frontend `
    --restart unless-stopped `
    -p 3000:80 `
    nopcommerce-frontend:latest

# Wait for container to be healthy
Write-Host "Waiting for container to be ready..."
Start-Sleep -Seconds 5

# Check if container is running
if (docker ps | Select-String -Pattern "nopcommerce-frontend") {
    Write-Host "Frontend deployment completed successfully!"
    Write-Host "Application is running on http://localhost:3000"
    Write-Host "Health check: http://localhost:3000/health"
} else {
    Write-Host "ERROR: Container failed to start"
    docker logs nopcommerce-frontend
    exit 1
}
