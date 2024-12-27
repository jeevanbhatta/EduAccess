import React from 'react';
import UploadForm from './components/UploadForm';
import Player from './components/Player';

function App() {
  const [audioFile, setAudioFile] = React.useState(null);
  const [brailleText, setBrailleText] = React.useState('');

  return (
    <div style={{ margin: '2rem' }}>
      <h1>EduAccess</h1>
      <UploadForm onAudioReceived={setAudioFile} onBrailleReceived={setBrailleText} />
      {audioFile && <Player audioFile={audioFile} />}
      {brailleText && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Braille Output</h2>
          <p style={{ fontSize: '1.5rem' }}>{brailleText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
