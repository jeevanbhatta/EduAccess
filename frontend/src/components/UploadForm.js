import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onAudioReceived, onBrailleReceived }) => {
  const [textInput, setTextInput] = useState('');
  const [textFile, setTextFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextFileUpload = async () => {
    if (!textFile) {
      alert('Please select a text file for upload');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', textFile);

      const response = await axios.post('http://localhost:5000/api/upload-text-file', formData);
      setTextInput(response.data.text); // Update the textarea with extracted text
    } catch (err) {
      console.error(err);
      alert(`Error extracting text: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToAudio = async () => {
    if (!textInput) {
      alert('Please enter or upload some text');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', textInput);

      const response = await axios.post('http://localhost:5000/api/text-to-audio', formData);
      onAudioReceived(response.data.audio_file);
    } catch (err) {
      console.error(err);
      alert(`Error converting text to audio: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToBraille = async () => {
    if (!textInput) {
      alert('Please enter or upload some text');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', textInput);

      const response = await axios.post('http://localhost:5000/api/text-to-braille', formData);
      onBrailleReceived(response.data.braille);
    } catch (err) {
      console.error(err);
      alert(`Error converting text to Braille: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoToAudio = async () => {
    if (!videoFile) {
      alert('Please select a video file for conversion to audio');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile);

      const response = await axios.post('http://localhost:5000/api/video-to-audio', formData);
      onAudioReceived(response.data.audio_file);
    } catch (err) {
      console.error(err);
      alert(`Error converting video to audio: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTextInput('');
    setTextFile(null);
    setVideoFile(null);
    setVideoFileName('');
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
        disabled={isLoading}
      />
      <br />
      <input
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={(e) => setTextFile(e.target.files[0])}
        disabled={isLoading}
      />
      <button onClick={handleTextFileUpload} disabled={isLoading}>
        {isLoading ? 'Extracting Text...' : 'Upload and Extract Text'}
      </button>
      <br />
      <button onClick={handleTextToAudio} disabled={isLoading}>
        {isLoading ? 'Converting Text to Audio...' : 'Convert Text to Audio'}
      </button>
      <button onClick={handleTextToBraille} disabled={isLoading}>
        {isLoading ? 'Converting Text to Braille...' : 'Convert Text to Braille'}
      </button>
      <br /><br />

      <h2>Upload Video</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          setVideoFile(e.target.files[0]);
          setVideoFileName(e.target.files[0]?.name || '');
        }}
        disabled={isLoading}
      />
      {videoFileName && <p>Selected File: {videoFileName}</p>}
      <button onClick={handleVideoToAudio} disabled={isLoading}>
        {isLoading ? 'Converting Video to Audio...' : 'Convert Video to Audio'}
      </button>
      <br /><br />

      <button onClick={handleReset} disabled={isLoading} style={{ backgroundColor: '#f44336', color: 'white' }}>
        Reset Form
      </button>
    </div>
  );
};

export default UploadForm;
