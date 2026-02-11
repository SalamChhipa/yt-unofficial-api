import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { SongModule } from './song/song.module';
import { StreamModule } from './stream/stream.module';
import { TrendingModule } from './trending/trending.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [SearchModule, SongModule, StreamModule, TrendingModule,ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
