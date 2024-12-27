import React from 'react';

const Player = ({ audioFile }) => {
  if (!audioFile) return null;

  // The backend endpoint to retrieve audio is /api/audio/:filename
  const audioUrl = `http://localhost:5000/api/audio/${audioFile}`;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Audio Player</h2>
      <audio controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
