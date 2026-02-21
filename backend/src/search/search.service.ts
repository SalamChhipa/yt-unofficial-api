// import { Injectable, OnModuleInit } from '@nestjs/common';
// import YTMusic from 'ytmusic-api';

// @Injectable()
// export class SearchService implements OnModuleInit {
//   private ytmusic: YTMusic;

//   async onModuleInit() {
//     this.ytmusic = new YTMusic();
//     await this.ytmusic.initialize();
//     console.log('YT Music initialized');
//   }

//   async searchSongs(query: string) {
//     const results = await this.ytmusic.search(query);

//     return results.map((song: any) => ({
//       videoId: song.videoId,
//       title: song.name,
//       artists: song.artists?.map(a => a.name).join(', '),
//       duration: song.duration,
//       thumbnail: song.thumbnails?.[song.thumbnails.length - 1]?.url,
//     }));
//   }
// }
import { Injectable } from '@nestjs/common';
import YTDlpWrap from 'yt-dlp-wrap';
import { exec } from 'child_process';

@Injectable()
export class SearchService {
  async searchSongs(query: string) {
    return new Promise((resolve, reject) => {
      exec(
        `docker exec -i vpn-test yt-dlp "ytsearch10:${query}" --flat-playlist --dump-json --match-filter "duration >= 60 & duration <= 600"`,
        (err, stdout) => {
          if (err) return reject(err);

          const results = stdout
            .trim()
            .split('\n')
            .map(line => JSON.parse(line))
            .map(v => ({
              videoId: v.id,
              title: v.title,
              duration: v.duration,
              thumbnail: v.thumbnail,
              artists: v.uploader,
            }));

          resolve(results);
        },
      );
    });
  }
}
