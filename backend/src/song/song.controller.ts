import { Controller, Get, Param } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get(':videoId')
  async getSong(@Param('videoId') videoId: string) {
    return this.songService.getSongInfo(videoId);
  }
}
