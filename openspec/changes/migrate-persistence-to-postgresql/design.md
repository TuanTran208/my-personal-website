# Design: Migrate Persistence to PostgreSQL

## Context
The goal is to transition from local file-based JSON storage to a unified PostgreSQL database. This allows real-time synchronization between the dev machine and the production server, and makes it compatible with Kitsu's PostgreSQL database instance.

## Goals / Non-Goals
### Goals
- Centralize all data in PostgreSQL tables.
- Synchronize stock tracking history (`vnindex_history`) and food organizer (`categories`, `restaurants`) data across multiple environments.
- Provide a `media_files` table to track uploaded video/image metadata (filename, mimetype, size, filepath) for future media storage features.
- Build an automatic data migration script that reads the existing JSON database files (`foodie-hub.json`, `vnindex.json`) and seeds the PostgreSQL database to prevent data loss.

### Non-Goals
- Storing actual binary video/image files as `bytea` blobs inside PostgreSQL. We will store files in the filesystem and save their path references in the database.

## Decisions

### 1. Database Connection
We will use `pg` (node-postgres) for connection pooling. It is simple, performs well, and has direct support for TypeScript.

Connection URL in `.env`:
`DATABASE_URL=postgresql://username:password@localhost:5432/pandory_hub`

In `src/db.ts`:
```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
```

### 2. Database Schema DDL

```sql
-- Food Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50)
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  rating NUMERIC(3, 2) DEFAULT 0.0,
  avg_price INTEGER DEFAULT 0,
  address TEXT,
  signature_dishes TEXT[] DEFAULT '{}',
  notes TEXT,
  is_unavailable BOOLEAN DEFAULT FALSE
);

-- Stock Index History Table
CREATE TABLE IF NOT EXISTS vnindex_history (
  timestamp BIGINT PRIMARY KEY,
  open NUMERIC(10, 2) NOT NULL,
  high NUMERIC(10, 2) NOT NULL,
  low NUMERIC(10, 2) NOT NULL,
  close NUMERIC(10, 2) NOT NULL,
  volume BIGINT NOT NULL
);

-- Media Files Table (Videos/Images Metadata)
CREATE TABLE IF NOT EXISTS media_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(512) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Data Migration (JSON -> Postgres)
Upon startup, the server will check if the database tables are empty. If they are, and local JSON files exist, it will automatically parse the JSON records and insert them into the PostgreSQL tables.

## Risks / Trade-offs
- **Connection Overhead**: Dev machine connecting directly to a remote production PostgreSQL instance might experience network latency. We will design the backend to use `Pool` query caching where appropriate, and keep queries highly optimized.
- **SSL configuration**: Remote connections typically require SSL. We will enable SSL connection parameters by default for production environments.
