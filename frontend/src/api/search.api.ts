import httpClient from './httpClient';

export interface Song {
  videoId: string;
  title: string;
  artists?: string;
  duration?: string;
  thumbnails?: { url: string }[];
}

export const searchSongs = async (query: string): Promise<Song[]> => {
  const res = await httpClient.get<Song[]>(`/search?q=${encodeURIComponent(query)}`);
  console.log(res.data)
  return res.data;
};
