// import React from 'react';

// export interface Song {
//   videoId: string;
//   title: string;
//   artists?: string;
//   duration?: string;
//   thumbnails?: { url: string }[];
// }

// interface SongListProps {
//   songs?: Song[];
//   onSelectSong?: (videoId: string) => void;
// }

// const SongList: React.FC<SongListProps> = ({ songs, onSelectSong }) => {
//   return (
//     <div style={{ marginBottom: '20px' }}>
//       {songs && songs.length > 0 ? (
//         songs.map((song) => (
//           <div
//             key={song.videoId}
//             style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
//             onClick={() => {
//               console.log('clicked')
//               return onSelectSong?.(song.videoId)}}
//           >
//             <p><strong>{song.title}</strong> - {song.artists}</p>
//           </div>
//         ))
//       ) : (
//         <p>Song list will appear here</p>
//       )}
//     </div>
//   );
// };

// export default SongList;
import React from 'react';

export interface Song {
  videoId: string;
  title: string;
  artists?: string;
  duration?: string;
  thumbnails?: { url: string }[];
}

interface SongListProps {
  songs?: Song[];
  onSelectSong?: (videoId: string) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, onSelectSong }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {songs && songs.length > 0 ? (
        songs.map((song) => (
          <button
            key={song.videoId}
            onClick={() => onSelectSong?.(song.videoId)}
            onTouchStart={() => onSelectSong?.(song.videoId)} // 👈 mobile fix
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '14px',
              minHeight: '48px', // 👈 critical
              borderBottom: '1px solid #eee',
              background: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>{song.title}</strong> – {song.artists}
            </p>
          </button>
        ))
      ) : (
        <p>Song list will appear here</p>
      )}
    </div>
  );
};

export default SongList;
