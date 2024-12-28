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
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '2rem', maxWidth: '600px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>EduAccess: Upload and Convert</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>1. Text Input</h3>
        <textarea
          rows="5"
          cols="50"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter or upload text for conversion"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          disabled={isLoading}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setTextFile(e.target.files[0])}
            disabled={isLoading}
            style={{ marginBottom: '0.5rem' }}
          />
          <button onClick={handleTextFileUpload} disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Extracting Text...' : 'Upload and Extract Text'}
          </button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleTextToAudio} disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Converting to Audio...' : 'Convert Text to Audio'}
          </button>
          <button onClick={handleTextToBraille} disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Converting to Braille...' : 'Convert Text to Braille'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>2. Video Upload</h3>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            setVideoFile(e.target.files[0]);
            setVideoFileName(e.target.files[0]?.name || '');
          }}
          disabled={isLoading}
        />
        {videoFileName && <p style={{ marginTop: '0.5rem' }}>Selected File: {videoFileName}</p>}
        <button onClick={handleVideoToAudio} disabled={isLoading} style={buttonStyle}>
          {isLoading ? 'Converting Video...' : 'Convert Video to Audio'}
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleReset}
          disabled={isLoading}
          style={{ ...buttonStyle, backgroundColor: '#ff4d4d', color: '#fff' }}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  margin: '5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default UploadForm;
