import React, { useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import SongList from '../components/SongList/SongList';
import type { Song } from '../components/SongList/SongList';
import Player from '../components/Player/Player';
import { searchSongs } from '../api/search.api';

const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | undefined>(undefined);

  const handleSearch = async (query: string) => {
    const result = await searchSongs(query);
    setSongs(result);
  };

  const handleSelectSong = (videoId: string) => {
    setCurrentVideo(videoId);
  };
  return (
    <div style={{ padding: '20px' }}>
      <h1>YT Music Unofficial</h1>
      <SearchBar onSearch={handleSearch} />
      <SongList songs={songs} onSelectSong={handleSelectSong} />
      <Player src={currentVideo ? `http://192.168.1.61:3000/api/stream/${currentVideo}` : undefined} />
    </div>
  );
};

export default Home;
