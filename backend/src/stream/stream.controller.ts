import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':videoId')
  stream(
    @Param('videoId') videoId: string,
    @Res() res: Response,
  ) {
    // res.setHeader('Content-Type', 'video/mp4');
    // res.setHeader('Accept-Ranges', 'bytes');
    // res.setHeader('Cache-Control', 'no-cache');
    console.log("🚀 ~ file: stream.controller.ts:14 ~ StreamController ~ stream ~ videoId", videoId)
    this.streamService.stream(videoId, res);
  }
}
