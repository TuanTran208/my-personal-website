
import fs from 'fs';
import { randomBytes } from 'crypto';

interface StagedFile {
    id: string;
    filePath: string;
    originalName: string;
    createdAt: number;
}

class DownloadStore {
    private store: Map<string, StagedFile> = new Map();
    private readonly TTL = 3600 * 1000; // 1 hour

    constructor() {
        // Run cleanup every 10 minutes
        setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }

    register(filePath: string, originalName: string): string {
        const id = randomBytes(16).toString('hex');
        this.store.set(id, {
            id,
            filePath,
            originalName,
            createdAt: Date.now()
        });
        return id;
    }

    get(id: string): StagedFile | undefined {
        return this.store.get(id);
    }

    cleanup() {
        const now = Date.now();
        for (const [id, file] of this.store.entries()) {
            if (now - file.createdAt > this.TTL) {
                // Try to delete file from disk
                try {
                    if (fs.existsSync(file.filePath)) {
                        fs.unlinkSync(file.filePath);
                    }
                } catch (err) {
                    console.error(`Failed to cleanup file ${file.filePath}:`, err);
                }
                this.store.delete(id);
            }
        }
    }
}

export const downloadStore = new DownloadStore();
