import { Module } from '@nestjs/common';
import { TrendingController } from './trending.controller';
import { TrendingService } from './trending.service';
import { ScheduleModule } from "@nestjs/schedule";
@Module({
  imports:[ScheduleModule.forRoot()],
  controllers: [TrendingController],
  providers: [TrendingService]
})
export class TrendingModule {}
