// import { google } from "googleapis";
// import * as fs from "fs";
// import * as path from "path";

// const youtube = google.youtube({
//   version: "v3",
//   auth: "AIzaSyD3uOb1VLbhpP-nKXl44RG7Z6-W8B-oHm8",
// });

// const DATA_PATH = path.join(process.cwd(), "data", "trending.json");

// export async function fetchTrendingMusic(region = "IN") {
//   const res = await youtube.videos.list({
//     part: ["snippet", "statistics", "contentDetails"],
//     chart: "mostPopular",
//     videoCategoryId: "10",
//     regionCode: region,
//     maxResults: 50,
//   });

//   const items =
//     res.data.items?.map((v) => ({
//       videoId: v.id,
//       title: v.snippet?.title,
//       artist: v.snippet?.channelTitle,
//       views: Number(v.statistics?.viewCount || 0),
//       likes: Number(v.statistics?.likeCount || 0),
//       duration: v.contentDetails?.duration,
//       publishedAt: v.snippet?.publishedAt,
//       fetchedAt: new Date().toISOString(),
//     })) || [];

//   fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
//   fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));

//   return items;
// }
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyD3uOb1VLbhpP-nKXl44RG7Z6-W8B-oHm8",
});

const DATA_PATH = path.join(process.cwd(), "data", "trending.json");

export interface FetchTrendingOptions {
  region?: string;
  categoryId?: string; // music=10
  maxResults?: number;
}

export async function fetchTrending(options: FetchTrendingOptions = {}) {
  const {
    region = "IN",
    categoryId = "10",
    maxResults = 50,
  } = options;

  const res = await youtube.videos.list({
    part: ["snippet", "statistics", "contentDetails"],
    chart: "mostPopular",
    videoCategoryId: categoryId,
    regionCode: region,
    maxResults,
  });

  const items =
    res.data.items?.map((v) => ({
      videoId: v.id,
      title: v.snippet?.title,
      artist: v.snippet?.channelTitle,
      views: Number(v.statistics?.viewCount || 0),
      likes: Number(v.statistics?.likeCount || 0),
      duration: v.contentDetails?.duration,
      publishedAt: v.snippet?.publishedAt,
      region,
      categoryId,
      fetchedAt: new Date().toISOString(),
    })) || [];

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));

  return {
    count: items.length,
    region,
    categoryId,
  };
}
