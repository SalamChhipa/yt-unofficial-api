import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import YTMusic from 'ytmusic-api';

@Injectable()
export class SongService implements OnModuleInit {
  private ytmusic: YTMusic;

  async onModuleInit() {
    this.ytmusic = new YTMusic();
    await this.ytmusic.initialize();
    console.log('YT Music initialized (SongService)');
  }

  async getSongInfo(videoId: string) {
    const song = await this.ytmusic.getSong(videoId);

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return {
      videoId,
      title: song.name,
      artists: song.artist.name,
      duration: song.duration,
      thumbnails: song.thumbnails,
    };
  }
}
