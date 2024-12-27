import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onAudioReceived, onBrailleReceived }) => {
  const [textInput, setTextInput] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleTextToAudio = async () => {
    if (!textInput) return alert('Please enter some text');
    try {
      const formData = new FormData();
      formData.append('text', textInput);

      const response = await axios.post('http://localhost:5000/api/text-to-audio', formData);
      onAudioReceived(response.data.audio_file);
    } catch (err) {
      console.error(err);
      alert('Error converting text to audio');
    }
  };

  const handleVideoToAudio = async () => {
    if (!videoFile) return alert('Please select a video file');
    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile);

      const response = await axios.post('http://localhost:5000/api/video-to-audio', formData);
      onAudioReceived(response.data.audio_file);
    } catch (err) {
      console.error(err);
      alert('Error converting video to audio');
    }
  };

  const handleTextToBraille = async () => {
    if (!textInput) return alert('Please enter some text');
    try {
      const formData = new FormData();
      formData.append('text', textInput);

      const response = await axios.post('http://localhost:5000/api/text-to-braille', formData);
      onBrailleReceived(response.data.braille);
    } catch (err) {
      console.error(err);
      alert('Error converting text to Braille');
    }
  };

  return (
    <div>
      <h2>Upload or Enter Text</h2>
      <textarea
        rows="4"
        cols="50"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text for TTS / Braille conversion"
      />
      <br />
      <button onClick={handleTextToAudio}>Convert Text to Audio</button>
      <button onClick={handleTextToBraille}>Convert Text to Braille</button>
      <br /><br />

      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
      <button onClick={handleVideoToAudio}>Convert Video to Audio</button>
    </div>
  );
};

export default UploadForm;
