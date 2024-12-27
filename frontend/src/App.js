import React, { useState } from 'react';
import UploadForm from './components/UploadForm';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [brailleText, setBrailleText] = useState('');

  // Handler to set the Braille text
  const handleBrailleReceived = (braille) => {
    setBrailleText(braille);
  };

  // Handler to set the audio file
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>EduAccess</h1>
      <UploadForm
        onAudioReceived={handleAudioReceived}
        onBrailleReceived={handleBrailleReceived}
      />
      {audioFile && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Audio File</h2>
          <audio controls src={`http://localhost:5000/api/audio/${audioFile}`}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {brailleText && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Braille Output</h2>
          <p style={{ fontSize: '1.5rem', backgroundColor: '#f4f4f4', padding: '10px' }}>
            {brailleText}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
