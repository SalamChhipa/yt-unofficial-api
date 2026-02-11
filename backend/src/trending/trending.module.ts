import { Module } from '@nestjs/common';
import { TrendingController } from './trending.controller';
import { TrendingService } from './trending.service';
import { ScheduleModule } from "@nestjs/schedule";
import { TrendingCron } from "./trending.cron";
@Module({
  // imports:[ScheduleModule.forRoot()],
  controllers: [TrendingController],
  providers: [TrendingService, TrendingCron]
})
export class TrendingModule {}
