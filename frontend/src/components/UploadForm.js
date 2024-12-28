import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onAudioReceived, onBrailleReceived }) => {
  const [textInput, setTextInput] = useState("");
  const [textFile, setTextFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (file, endpoint, callback) => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear previous errors
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      callback(response.data);
    } catch (err) {
      console.error(`Error uploading file to ${endpoint}:`, err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonRequest = async (data, endpoint, callback) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear previous errors
      const response = await axios.post(endpoint, data, {
        headers: { "Content-Type": "application/json" },
      });
      callback(response.data);
    } catch (err) {
      console.error(`Error sending data to ${endpoint}:`, err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextFileUpload = async () => {
    await handleFileUpload(textFile, "http://localhost:5000/api/upload-text-file", (data) =>
      setTextInput(data.text || "")
    );
  };

  const handleAnalyzeImage = async () => {
    await handleFileUpload(imageFile, "http://localhost:5000/api/analyze-image", (data) =>
      setTextInput(data.text || "")
    );
  };

  const handleVideoToAudio = async () => {
    await handleFileUpload(videoFile, "http://localhost:5000/api/video-to-audio", (data) =>
      onAudioReceived(data.audio_file)
    );
  };

  const handleTextToAudio = async () => {
    if (!textInput.trim()) {
      alert("Please enter text for conversion.");
      return;
    }

    await handleJsonRequest(
      { text: textInput.trim() },
      "http://localhost:5000/api/text-to-audio",
      (data) => onAudioReceived(data.audio_file)
    );
  };

  const handleTextToBraille = async () => {
    const trimmedText = textInput.trim(); // Trim the text input
    if (!trimmedText) {
      alert("Please enter text for conversion.");
      return;
    }
  
    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear any previous error message
      const response = await axios.post(
        "http://localhost:5000/api/text-to-braille",
        { text: trimmedText }, // Send trimmed text
        { headers: { "Content-Type": "application/json" } }
      );
      onBrailleReceived(response.data.braille);
    } catch (err) {
      console.error("Error converting text to Braille:", err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleReset = () => {
    setTextInput("");
    setTextFile(null);
    setVideoFile(null);
    setImageFile(null);
    setVideoFileName("");
    setImageFileName("");
    setErrorMessage("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "2rem", maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>EduAccess: Upload and Convert</h2>
      {errorMessage && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            marginBottom: "1rem",
            borderRadius: "5px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Text Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="text-section">
        <h3 id="text-section">1. Text Input</h3>
        <textarea
          aria-label="Enter text for conversion"
          rows="5"
          cols="50"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter or upload text for conversion"
          disabled={isLoading}
        />
        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setTextFile(e.target.files[0])}
          disabled={isLoading}
          aria-label="Upload a text file"
        />
        <button onClick={handleTextFileUpload} disabled={isLoading}>
          {isLoading ? "Extracting Text..." : "Upload and Extract Text"}
        </button>
        <button onClick={handleTextToAudio} disabled={isLoading}>
          {isLoading ? "Converting to Audio..." : "Convert Text to Audio"}
        </button>
        <button onClick={handleTextToBraille} disabled={isLoading}>
          {isLoading ? "Converting to Braille..." : "Convert Text to Braille"}
        </button>
      </div>

      {/* Image Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="image-section">
        <h3 id="image-section">2. Image Upload</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImageFile(e.target.files[0]);
            setImageFileName(e.target.files[0]?.name || "");
          }}
          disabled={isLoading}
          aria-label="Upload an image file"
        />
        {imageFileName && <p>Selected File: {imageFileName}</p>}
        <button onClick={handleAnalyzeImage} disabled={isLoading}>
          {isLoading ? "Analyzing Image..." : "Analyze Image"}
        </button>
      </div>

      {/* Video Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="video-section">
        <h3 id="video-section">3. Video Upload</h3>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            setVideoFile(e.target.files[0]);
            setVideoFileName(e.target.files[0]?.name || "");
          }}
          disabled={isLoading}
          aria-label="Upload a video file"
        />
        {videoFileName && <p>Selected File: {videoFileName}</p>}
        <button onClick={handleVideoToAudio} disabled={isLoading}>
          {isLoading ? "Converting Video..." : "Convert Video to Audio"}
        </button>
      </div>

      <button onClick={handleReset} disabled={isLoading} style={{ backgroundColor: "#ff4d4d", color: "#fff" }}>
        Reset Form
      </button>
    </div>
  );
};

export default UploadForm;