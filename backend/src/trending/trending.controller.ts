// import { Controller, Get, Query } from "@nestjs/common";
// import { TrendingService } from "./trending.service";

// @Controller("trending")
// export class TrendingController {
//   constructor(private readonly service: TrendingService) {}

//   @Get()
//   getTrending(
//     @Query("sort") sort: "views" | "likes" | "latest",
//     @Query("limit") limit: number,
//   ) {
//     return this.service.getTrending({
//       sort,
//       limit: Number(limit),
//     });
//   }
// }
import {
  Controller,
  Get,
  Query,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { TrendingService } from "./trending.service";
import { fetchTrending } from "./trending.fetcher";

@Controller("trending")
export class TrendingController {
  constructor(private readonly service: TrendingService) {}

  // public endpoint
  @Get()
  getTrending(
    @Query("sort") sort: "views" | "likes" | "latest",
    @Query("limit") limit: number,
  ) {
    return this.service.getTrending({
      sort,
      limit: Number(limit),
    });
  }

  // 🔐 manual fetch (private)
  @Get("refresh")
  async manualRefresh(
    @Headers("x-admin-key") key: string,
    @Query("region") region: string,
    @Query("categoryId") categoryId: string,
    @Query("maxResults") maxResults: number,
  ) {
    if (key !== "salamtak") {
      throw new UnauthorizedException("Not allowed");
    }

    return fetchTrending({
      region,
      categoryId,
      maxResults: Number(maxResults)|| 50,
    });
  }
}
