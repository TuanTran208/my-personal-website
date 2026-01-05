# Project Context

## Purpose
"Pandory Hub" is a personal server dashboard application designed to manage and monitor various services and utilities. It serves as a central interface for personal projects, including file conversions, media handling, and potentially stock dashboards and home automation integrations.

## Tech Stack
### Frontend (`pandory-hub`)
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State/Routing**: vue-router
- **Visualization**: Chart.js (via vue-chartjs)

### Backend (`pandory-hub-backend`)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Tools**:
    - `fluent-ffmpeg` & `ffmpeg` for media processing
    - `sharp` for image processing
    - `yt-dlp-exec` for video downloading
    - `docx`, `pdf-parse`, `libreoffice-convert` for document handling

## Project Conventions

### Code Style
- **Frontend**: Vue Single File Components (SFC) with `<script setup>`.
- **Backend**: TypeScript with rigid typing.
- **Formatting**: Likely Prettier/Standard (implied by standard deps).

### Structure
- Monorepo-like structure with separate `pandory-hub` (frontend) and `pandory-hub-backend` (backend) directories.

### Architecture Patterns
- **Frontend**: Component-based architecture.
- **Backend**: REST API handling specialized tasks (media, files).

## Domain Context
- The system handles heavy media processing (video/image) and document conversion, requiring async handling and likely progress tracking.

## External Dependencies
- FFmpeg (system dependency)
- LibreOffice (system dependency for conversions)
