import { Injectable, OnModuleInit } from '@nestjs/common';
import YTMusic from 'ytmusic-api';

@Injectable()
export class SearchService implements OnModuleInit {
  private ytmusic: YTMusic;

  async onModuleInit() {
    this.ytmusic = new YTMusic();
    await this.ytmusic.initialize();
    console.log('YT Music initialized');
  }

  async searchSongs(query: string) {
    const results = await this.ytmusic.search(query);

    return results.map((song: any) => ({
      videoId: song.videoId,
      title: song.name,
      artists: song.artists?.map(a => a.name).join(', '),
      duration: song.duration,
      thumbnail: song.thumbnails?.[song.thumbnails.length - 1]?.url,
    }));
  }
}
