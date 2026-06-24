# Pandory Hub - Personal Server Dashboard

Pandory Hub is a self-hosted personal server dashboard application designed to manage, monitor, and execute utilities such as media file conversion, system resource monitoring, and dining tracking.

---

## 🛠️ Technology Stack

### Frontend (`pandory-hub`)
*   **Core:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
*   **Build Tool:** [Vite](https://vite.dev/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **Styling:** [TailwindCSS](https://tailwindcss.com/)
*   **Visualization:** [Chart.js](https://www.chartjs.org/) (via [vue-chartjs](https://vue-chartjs.org/))

### Backend (`pandory-hub-backend`)
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Web Framework:** [Express.js](https://expressjs.com/)
*   **Database Persistence:** [PostgreSQL](https://www.postgresql.org/) (via connection pooling with `pg`)
*   **Authentication:** Discord OAuth2 authorization code grant & stateless JWT session handling
*   **Media Processing:** [FFmpeg](https://ffmpeg.org/) (via `fluent-ffmpeg`), [Sharp](https://sharp.pixelplumbing.com/) (image manipulation), and [yt-dlp](https://github.com/yt-dlp/yt-dlp) for video downloading
*   **System Diagnostics:** [systeminformation](https://systeminformation.io/) for hardware metrics

---

## 📂 Project Structure

```
pandory-hub/
├── frontend/                # Vue 3 Frontend App
│   ├── src/
│   │   ├── components/         # Reusable dashboard widgets & toolcards
│   │   ├── composables/        # Shared state & hooks (e.g. useAuth)
│   │   ├── router/             # Frontend route guards & definitions
│   │   └── views/              # Page layouts (Home, FoodieHub, etc.)
│   └── vite.config.js          # Vite config & API reverse proxy proxying to :3001
│
├── backend/                 # Express TypeScript API Backend
│   ├── src/
│   │   ├── routes/             # REST endpoints (health, auth, foodie-hub)
│   │   ├── services/           # Business logic & external tool wrappers
│   │   ├── middleware/         # Express middlewares (JWT gates)
│   │   └── db.ts               # PostgreSQL database connection pool
│   └── tsconfig.json           # TypeScript configuration
│
├── openspec/                   # OpenSpec specification-driven development rules
│   ├── specs/                  # Current truth of implemented capabilities
│   └── changes/                # Active and archived change proposals
│
└── docs/superpowers/plans/     # Converted Superpowers TDD execution plans
```

---

## 🚀 Running the Application Locally

You will need two terminal windows open to run both services simultaneously.

### 1. Run the Backend Server
1.  Navigate to the backend directory:
    ```bash
    cd pandory-hub-backend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env` file based on `.env.example` and fill in:
    ```env
    PORT=3001
    DATABASE_URL=postgresql://username:password@localhost:5432/pandory_hub
    DISCORD_CLIENT_ID=your_client_id
    DISCORD_CLIENT_SECRET=your_client_secret
    DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
    DISCORD_OWNER_ID=your_discord_snowflake_id
    JWT_SECRET=your_jwt_signing_secret
    ```
4.  Start development server (with nodemon):
    ```bash
    npm run dev
    ```

### 2. Run the Frontend Development Server
1.  Navigate to the frontend directory:
    ```bash
    cd ../pandory-hub
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Start Vite:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📦 Production Build

To compile and bundle both applications for production:

### Frontend Build
```bash
cd pandory-hub
npm run build
```
This outputs static assets to `pandory-hub/dist/`.

### Backend Build
```bash
cd pandory-hub-backend
npm run build
```
This compiles TypeScript files into JS outputs inside `pandory-hub-backend/dist/`.
Start production server:
```bash
npm start
```