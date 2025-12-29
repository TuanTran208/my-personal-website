#!/bin/bash

# Deployment Script for Pandory Hub
# 1. Builds Frontend
# 2. Prepares Backend
# 3. Merges them into a single runnable unit

echo "🚀 Starting Deployment Process..."

# Directories
REPO_ROOT=$(pwd)
FRONTEND_DIR="$REPO_ROOT/pandory-hub"
BACKEND_DIR="$REPO_ROOT/pandory-hub-backend"

# 1. Build Frontend
echo "📦 Building Frontend..."
cd "$FRONTEND_DIR" || exit
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed."
    exit 1
fi
echo "✅ Frontend built successfully."

# 2. Prepare Backend Static Files
echo "📂 Moving Frontend to Backend..."
cd "$BACKEND_DIR" || exit
# Create public dir if not exists
mkdir -p public
# Clear old files
rm -rf public/*
# Copy new build
cp -r "$FRONTEND_DIR/dist/"* public/
echo "✅ Frontend assets moved to backend/public."

# 3. Build Backend (Optional if using ts-node in prod, but better to build)
echo "🛠️  Building Backend..."
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed."
    exit 1
fi
echo "✅ Backend built successfully."

# 4. Final Instructions
echo "------------------------------------------------"
echo "🎉 Deployment Preparation Complete!"
echo "------------------------------------------------"
echo "To run the server on Linux:"
echo "1. Navigate to: $BACKEND_DIR"
echo "2. Run: npm start"
echo "   (Ensure process.env.PORT is set, default 3001)"
echo "------------------------------------------------"
