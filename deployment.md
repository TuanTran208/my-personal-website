# Deployment Guide

This guide explains how to deploy the **Pandory Hub** (frontend + backend) as a single Node.js process on a Linux server.

## Prerequisites

-   **Node.js** (v18+)
-   **npm**
-   **ffmpeg** (for video processing, creating thumbnails)
    -   `sudo apt update && sudo apt install ffmpeg`

## 1. Local Preparation (Windows)

Since you are developing on Windows, you can use the provided bash script if you have Git Bash, or run the steps manually.

### One-Click Build Script
1.  Open Git Bash (or WSL) in the project root.
2.  Run:
    ```bash
    ./deploy.sh
    ```
    This script will:
    -   Build the frontend.
    -   Copy the build artifacts to `pandory-hub-backend/public`.
    -   Build the backend.

### Manual Steps
If you can't run the script:
1.  **Frontend**: `cd pandory-hub` -> `npm run build` -> Copy `dist` folder to `pandory-hub-backend/public`.
2.  **Backend**: `cd pandory-hub-backend` -> `npm run build`.

## 2. Server Upload

Upload the entire **`pandory-hub-backend`** folder to your Linux server. 
*Note: You can exclude `node_modules` to save time, and install them on the server.*

```bash
# Example using scp
scp -r pandory-hub-backend user@your-server-ip:/var/www/pandory-hub
```

## 3. Server Setup

1.  SSH into your server.
2.  Navigate to the folder:
    ```bash
    cd /var/www/pandory-hub
    ```
3.  Install dependencies:
    ```bash
    npm install --production
    ```
4.  **Configure Environment Variables**:
    Since `.env` files are not committed to Git, you must create one manually on the server.
    
    a. Copy the example file:
    ```bash
    cp .env.example .env
    ```
    
    b. Edit the file:
    ```bash
    nano .env
    ```
    
    c. Fill in your secrets (e.g., `API_ACCESS_KEY`):
    ```env
    PORT=3000
    API_ACCESS_KEY=your_secure_password_here
    DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
    ```

## 4. Run the Server

You can run it directly or use a process manager like PM2 (recommended).

### Using PM2 (Recommended)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the server
pm2 start dist/index.js --name "pandory-hub"

# Save startup list
pm2 save
pm2 startup
```

### Direct Run
```bash
npm start
```

## Accessing the App

Open your browser and navigate to `http://your-server-ip:3000`. You should see the Pandory Hub frontend, and all API calls will be handled by the same server.
