import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SongModule } from './song/song.module';
import { StreamModule } from './stream/stream.module';
import { TrendingModule } from './trending/trending.module';

@Module({
  imports: [SearchModule, SongModule, StreamModule, TrendingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
