#!/bin/bash
set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    echo "Example: $0 production"
    exit 1
fi

echo "Deploying frontend to $ENVIRONMENT environment..."

# Build the Docker image
echo "Building Docker image..."
docker build -t nopcommerce-frontend:latest .

# Stop existing container if running
echo "Stopping existing container..."
docker stop nopcommerce-frontend || true
docker rm nopcommerce-frontend || true

# Run new container
echo "Starting new container..."
docker run -d \
    --name nopcommerce-frontend \
    --restart unless-stopped \
    -p 3000:80 \
    nopcommerce-frontend:latest

# Wait for container to be healthy
echo "Waiting for container to be ready..."
sleep 5

# Check if container is running
if docker ps | grep -q nopcommerce-frontend; then
    echo "Frontend deployment completed successfully!"
    echo "Application is running on http://localhost:3000"
    echo "Health check: http://localhost:3000/health"
else
    echo "ERROR: Container failed to start"
    docker logs nopcommerce-frontend
    exit 1
fi
