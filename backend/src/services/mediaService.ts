
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ytDlp from 'yt-dlp-exec';
import sharp from 'sharp';

// Setup FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const OUTPUT_DIR = path.join(__dirname, '../../downloads');
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure stats
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const mediaService = {
    // 1. Compress Video
    compressVideo: (filePath: string, quality: 'High' | 'Medium' | 'Low', format: string = 'mp4'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileName = path.basename(filePath, path.extname(filePath));
            const safeFormat = ['mp4', 'mkv', 'mov'].includes(format) ? format : 'mp4';
            const outputPath = path.join(OUTPUT_DIR, `${fileName}_compressed.${safeFormat}`);

            let crf = 23; // Medium
            if (quality === 'High') crf = 28;
            if (quality === 'Low') crf = 18;

            ffmpeg(filePath)
                .outputOptions([
                    '-c:v libx265',
                    `-crf ${crf}`,
                    '-c:a aac',
                    '-preset slower'
                ])
                .save(outputPath)
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err));
        });
    },

    // 2. Download Video
    downloadVideo: async (url: string): Promise<{ title: string, path: string }> => {
        try {
            console.log(`Downloading: ${url}`);

            // Cookie check
            const cookiesPath = path.join(__dirname, '../../data/cookies.txt');
            const hasCookies = fs.existsSync(cookiesPath);

            if (hasCookies) {
                console.log('Using cookies.txt for authentication');
            }

            // Get Info first
            const infoFlags: any = { dumpSingleJson: true };
            if (hasCookies) infoFlags.cookies = cookiesPath;

            const info = await ytDlp(url, infoFlags);
            const title = info.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
            const outputPath = path.join(OUTPUT_DIR, `${title}.mp4`);

            // Download
            const flags: any = {
                output: outputPath,
                format: 'best[ext=mp4]',
                noPlaylist: true
            };
            if (hasCookies) flags.cookies = cookiesPath;

            await ytDlp(url, flags);

            return { title: info.title, path: outputPath };
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    },

    // 3. Convert Image
    convertImage: async (filePath: string, format: 'png' | 'jpg' | 'webp'): Promise<string> => {
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputPath = path.join(OUTPUT_DIR, `${fileName}.${format}`);

        let pipeline = sharp(filePath);
        if (format === 'jpg') pipeline = pipeline.jpeg();
        if (format === 'png') pipeline = pipeline.png();
        if (format === 'webp') pipeline = pipeline.webp();

        await pipeline.toFile(outputPath);
        return outputPath;
    },

    // 4. PDF to Markdown component/ DOCX
    convertPdf: (filePath: string, format: 'markdown' | 'docx' = 'markdown'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const pdf = require('pdf-parse');
            const path = require('path');
            const fs = require('fs');
            const { Document, Packer, Paragraph, TextRun } = require('docx');

            const fileName = path.basename(filePath, path.extname(filePath));
            const extension = format === 'docx' ? 'docx' : 'md';
            const outputPath = path.join(OUTPUT_DIR, `${fileName}.${extension}`);

            const dataBuffer = fs.readFileSync(filePath);

            pdf(dataBuffer).then(async (data: any) => {
                if (format === 'markdown') {
                    const content = `# ${fileName}\n\n${data.text}`;
                    fs.writeFileSync(outputPath, content);
                    resolve(outputPath);
                } else if (format === 'docx') {
                    // Create simple DOCX with extracted text
                    // Splitting by newlines to create paragraphs
                    const lines = data.text.split('\n');
                    const paragraphs = lines.map((line: string) =>
                        new Paragraph({
                            children: [new TextRun(line)],
                        })
                    );

                    // Add Title
                    paragraphs.unshift(new Paragraph({
                        children: [new TextRun({ text: fileName, bold: true, size: 32 })],
                        spacing: { after: 400 }
                    }));

                    const doc = new Document({
                        sections: [{
                            properties: {},
                            children: paragraphs,
                        }],
                    });

                    const buffer = await Packer.toBuffer(doc);
                    fs.writeFileSync(outputPath, buffer);
                    resolve(outputPath);
                }
            }).catch((err: any) => {
                reject(err);
            });
        });
    },

    // Helper to clear file
    cleanup: (filePath: string) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
};
