// import { Injectable } from '@nestjs/common';
// import { spawn } from 'child_process';
// import * as fs from 'fs';
// @Injectable()
// export class StreamService {

//   async stream(videoId: string, res: any) {
//     const url = `https://www.youtube.com/watch?v=${videoId}`;
//     const filePath = `${process.cwd()}/downloads/${videoId}.mp3`;

//     if (!fs.existsSync(filePath)) {
//       await this.downloadMp3(url,videoId);
//     }

//     res.set({
//       'Content-Type': 'audio/mpeg',
//       'Content-Disposition': 'inline',
//     });

//     fs.createReadStream(filePath).pipe(res);
//   }

//   downloadMp3(url: string,videoId:string): Promise<void> {
//     const filePath = `/root/music/${videoId}.mp3`
//     return new Promise((resolve, reject) => {
//       const yt = spawn('docker', [
//   'exec',
//   'vpn-test',
//   'yt-dlp',
//   '-x',
//   '--audio-format', 'mp3',
//   '--audio-quality', '0',
//   '-o', `/root/music/${videoId}.mp3`,
//   url,
// ]);


//       yt.stderr.on('data', d => console.log('[yt-dlp]', d.toString()));

//       yt.on('close', code => {
//         code === 0 ? resolve() : reject('yt-dlp failed');
//       });
//     });
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { spawn } from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class StreamService {

//   private MUSIC_DIR = '/root/music';

//   async stream(videoId: string, res: any) {
//     const filePath = process.cwd() + `/${videoId}.mp3`;
//     const url = `https://www.youtube.com/watch?v=${videoId}`;

//     res.set({
//       'Content-Type': 'audio/mpeg',
//       'Content-Disposition': 'inline',
//       'Accept-Ranges': 'bytes',
//     });

//     // 🔥 CASE 1: file already downloaded
//     if (fs.existsSync(filePath)) {
//       fs.createReadStream(filePath).pipe(res);
//       return;
//     }

//     // 🔥 CASE 2: file nahi hai → direct stream + save
//     this.streamAndSave(url, filePath, res);
//   }

//   private streamAndSave(url: string, filePath: string, res: any) {
//     const yt = spawn('docker', [
//       'exec',
//       '-i',
//       'vpn-test',
//       'yt-dlp',
//       '-x',
//       '--audio-format', 'mp3',
//       '--audio-quality', '0',
//       '-o', '-',       // 👈 stdout pe bhej
//       url,
//     ]);

//     // 👇 file me bhi save hoga
//     const fileStream = fs.createWriteStream(filePath);

//     yt.stdout.pipe(res);        // user ko turant audio
//     yt.stdout.pipe(fileStream); // background save

//     yt.stderr.on('data', d => {
//       console.log('[yt-dlp]', d.toString());
//     });

//     yt.on('close', code => {
//       if (code !== 0) {
//         console.error('yt-dlp failed');
//         res.end();
//       }
//     });

//     res.on('close', () => {
//       yt.kill('SIGKILL'); // user ne player band kar diya
//     });
//   }
// }
// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { spawn } from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class StreamService {

//   private MUSIC_DIR = path.join(process.cwd(), 'downloads');

//   constructor() {
//     if (!fs.existsSync(this.MUSIC_DIR)) {
//       fs.mkdirSync(this.MUSIC_DIR, { recursive: true });
//     }
//   }

//   async stream(videoId: string, res: any) {
//     const filePath = path.join(this.MUSIC_DIR, `${videoId}.mp3`);
//     const url = `https://www.youtube.com/watch?v=${videoId}`;

//     res.set({
//       'Content-Type': 'audio/mpeg',
//       'Content-Disposition': 'inline',
//       'Accept-Ranges': 'bytes',
//     });

//     // ✅ CASE 1: File already exists
//     if (fs.existsSync(filePath)) {
//       return fs.createReadStream(filePath).pipe(res);
//     }

//     // ✅ CASE 2: Stream live + save background
//     return this.streamAndSave(url, filePath, res);
//   }

//   private streamAndSave(url: string, filePath: string, res: any) {

//     const yt = spawn('docker', [
//       'exec',
//       '-i',
//       'vpn-test',
//       'yt-dlp',
//       '-x',
//       '--audio-format', 'mp3',
//       '--audio-quality', '0',
//       '-o', '-',
//       url,
//     ]);

//     const fileStream = fs.createWriteStream(filePath);

//     let errorMessage = '';

//     // 🔥 Stream to user
//     yt.stdout.pipe(res);

//     // 🔥 Save to file
//     yt.stdout.pipe(fileStream);

//     // 🔥 Capture errors
//     yt.stderr.on('data', (data) => {
//       const msg = data.toString();
//       console.error('[yt-dlp]', msg);
//       errorMessage += msg;
//     });

//     yt.on('close', (code) => {
//       if (code !== 0) {
//         console.error('yt-dlp failed');

//         if (!res.headersSent) {
//           res.status(500).json({
//             success: false,
//             message: 'Failed to fetch audio',
//             error: errorMessage || 'yt-dlp error',
//           });
//         }

//         // delete corrupted file
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       }
//     });

//     // 🔥 If user closes player
//     res.on('close', () => {
//       yt.kill('SIGKILL');
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StreamService {

  private MUSIC_DIR = path.join(process.cwd(), 'downloads');

  constructor() {
    if (!fs.existsSync(this.MUSIC_DIR)) {
      fs.mkdirSync(this.MUSIC_DIR, { recursive: true });
    }
  }

  // ===============================
  // MAIN STREAM FUNCTION
  // ===============================
  async stream(videoId: string,req:any, res: any) {

    const filePath = path.join(this.MUSIC_DIR, `${videoId}.mp3`);
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // 🔥 1️⃣ Health Check
    const isHealthy = await this.checkYoutubeHealth();

   

    // 🔥 2️⃣ If already downloaded → serve
    if (fs.existsSync(filePath)) {
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline',
        'Accept-Ranges': 'bytes',
      });

      // return fs.createReadStream(filePath).pipe(res);
      return this.streamWithSeek(filePath, req, res);
    }

    // 🔥 3️⃣ Download first
    try {
       if (!isHealthy) {
      return res.status(503).json({
        success: false,
        message: 'Server busy. Please try again.'
      });
    }
      await this.downloadMp3(url, filePath,videoId);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to download audio',
        error: err || 'Download error'
      });
    }

    // 🔥 4️⃣ Serve after download
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
      'Accept-Ranges': 'bytes',
    });

    // return fs.createReadStream(filePath).pipe(res);
      return this.streamWithSeek(filePath, req, res);

  }

  // ===============================
  // DOWNLOAD FUNCTION
  // ===============================
  private downloadMp3(url: string, filePath: string,videoId:string): Promise<void> {

    return new Promise((resolve, reject) => {

      const yt = spawn('docker', [
        'exec',
        'vpn-test',
        'yt-dlp',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '-o', `/root/music/${videoId}.mp3`,
        url,
      ]);

      let errorMessage = '';

      const timeout = setTimeout(() => {
        yt.kill('SIGKILL');
        reject('Download timeout');
      }, 120000); // 2 min safety timeout

      yt.stderr.on('data', (data) => {
        const msg = data.toString();
        console.error('[yt-dlp]', msg);
        errorMessage += msg;
      });

      yt.on('close', (code) => {
        clearTimeout(timeout);

        if (code === 0) {
          resolve();
        } else {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(errorMessage || 'yt-dlp failed');
        }
      });

      yt.on('error', (err) => {
        clearTimeout(timeout);
        reject(err.message);
      });

    });
  }

  // ===============================
  // YOUTUBE HEALTH CHECK
  // ===============================
  private checkYoutubeHealth(): Promise<boolean> {

    return new Promise((resolve) => {

      const curl = spawn('docker', [
        'exec',
        'vpn-test',
        'curl',
        '-I',
        '--silent',
        '--fail',
        '--max-time', '5',
        'https://www.youtube.com'
      ]);

      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          curl.kill('SIGKILL');
          resolved = true;
          resolve(false);
        }
      }, 6000);

      curl.on('close', (code) => {
        if (!resolved) {
          clearTimeout(timeout);
          resolved = true;
          resolve(code === 0);
        }
      });

      curl.on('error', () => {
        if (!resolved) {
          clearTimeout(timeout);
          resolved = true;
          resolve(false);
        }
      });

    });
  }

  private streamWithSeek(filePath: string, req: any, res: any) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : fileSize - 1;

  if (start >= fileSize) {
    res.status(416).send('Requested range not satisfiable');
    return;
  }

  const chunkSize = end - start + 1;

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'audio/mpeg',
  });

  fs.createReadStream(filePath, { start, end }).pipe(res);
}
}
