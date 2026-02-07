import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { fetchTrending } from "./trending.fetcher";

@Injectable()
export class TrendingCron {
  @Cron("0 * * * *") // every hour
  async handleCron() {
    console.log("⏰ Fetching trending music...");
    await fetchTrending({region:"IN", categoryId:"10", maxResults:50});
  }
}
