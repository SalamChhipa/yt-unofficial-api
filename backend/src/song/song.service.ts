import { Injectable, NotFoundException } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class SongService {
  async getSongInfo(videoId: string) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    return new Promise((resolve, reject) => {
      const yt = spawn('docker', [
        'exec',
        'vpn-test',
        'yt-dlp',
        '-j',                 // JSON metadata only
        '--no-playlist',
        url,
      ]);

      let output = '';
      let error = '';

      yt.stdout.on('data', (d) => (output += d.toString()));
      yt.stderr.on('data', (d) => (error += d.toString()));

      yt.on('close', (code) => {
        if (code !== 0 || !output) {
          return reject(
            new NotFoundException(
              `Song not found or yt-dlp failed: ${error}`,
            ),
          );
        }

        const data = JSON.parse(output);

        resolve({
          videoId,
          title: data.title,
          artists:
            data.artist ||
            data.creator ||
            data.uploader ||
            'Unknown',
          duration: data.duration,
          thumbnails: [
            { url: data.thumbnail, width: 0, height: 0 },
          ],
        });
      });
    });
  }
}

