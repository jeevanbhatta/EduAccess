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
    <div style={{ margin: '2rem', fontFamily: 'Arial, sans-serif' }}>
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
          {/* Use a <pre> tag to preserve formatting like line breaks and spaces */}
          <pre
            style={{
              fontSize: '1.5rem',
              backgroundColor: '#f4f4f4',
              padding: '10px',
              whiteSpace: 'pre-wrap', // Ensures spacing is preserved
              wordWrap: 'break-word', // Allows wrapping of long text
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}
          >
            {brailleText}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;