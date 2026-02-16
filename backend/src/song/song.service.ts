import { Injectable, NotFoundException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

@Injectable()
export class SongService {
  async getSongInfo(videoId: string) {
    try {
      const { stdout } = await execFileAsync('yt-dlp', [
        '-j',
        `https://www.youtube.com/watch?v=${videoId}`,
      ]);

      const data = JSON.parse(stdout);

      return {
        videoId: data.id,
        title: data.title,
        artists: data.artist || data.uploader,
        duration: data.duration, // seconds
        thumbnail: data.thumbnails[0].url,
      };
    } catch (error) {
      throw new NotFoundException('Song not found or yt-dlp error');
    }
  }
}
