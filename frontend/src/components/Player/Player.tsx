import React from 'react';

interface PlayerProps {
  src?: string;
}

const Player: React.FC<PlayerProps> = ({ src }) => {
  return (
    <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <p>Player will appear here</p>
      <audio controls src={src}></audio>
    </div>
  );
};

export default Player;
