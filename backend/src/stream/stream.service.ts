import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
@Injectable()
export class StreamService {

  async stream(videoId: string, res: any) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const filePath = `${process.cwd()}/downloads/${videoId}.mp3`;

    if (!fs.existsSync(filePath)) {
      await this.downloadMp3(url,videoId);
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
    });

    fs.createReadStream(filePath).pipe(res);
  }

  downloadMp3(url: string,videoId:string): Promise<void> {
    const filePath = `/root/music/${videoId}.mp3`
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


      yt.stderr.on('data', d => console.log('[yt-dlp]', d.toString()));

      yt.on('close', code => {
        code === 0 ? resolve() : reject('yt-dlp failed');
      });
    });
  }
}
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
