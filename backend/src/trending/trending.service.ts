import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "trending.json");

@Injectable()
export class TrendingService {
  private readData() {
    if (!fs.existsSync(DATA_PATH)) return [];
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }

  getTrending(filters: {
    sort?: "views" | "likes" | "latest";
    limit?: number;
  }) {
    let data = this.readData();

    // predefined filters
    if (filters.sort === "views") {
      data.sort((a, b) => b.views - a.views);
    }

    if (filters.sort === "likes") {
      data.sort((a, b) => b.likes - a.likes);
    }

    if (filters.sort === "latest") {
      data.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
    }

    return data.slice(0, filters.limit || 10);
  }
}
