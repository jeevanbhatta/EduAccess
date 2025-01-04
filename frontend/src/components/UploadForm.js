import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onAudioReceived, onBrailleReceived, onTextReceived }) => {
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
      setErrorMessage("");
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
      setErrorMessage("");
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
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.post("http://localhost:5000/api/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      console.log("Image analysis result:", data);

      if (data.caption?.text) {
        // Send the extracted caption to the parent to display
        onTextReceived(data.caption.text, { confidence: data.caption.confidence });
        // Also provide the braille version of the caption
        onBrailleReceived(data.braille_caption || "");
      } else {
        alert("No meaningful description generated.");
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoToAudio = async () => {
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.post("http://localhost:5000/api/video-to-audio", formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const audioUrl = URL.createObjectURL(response.data);
      onAudioReceived(audioUrl);
    } catch (err) {
      console.error("Error in handleVideoToAudio:", err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoToTextAndBraille = async () => {
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", videoFile);
  
    try {
      setIsLoading(true);
      setErrorMessage("");
  
      // Make a POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/video-to-text-and-braille",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      const data = response.data;
  
      // Update both text and braille output
      if (data.text) {
        setTextInput(data.text || ""); // Update the text input field
        onTextReceived(data.text); // Notify parent about the new text
      } else {
        console.warn("No text received from the backend.");
      }
  
      if (data.braille) {
        onBrailleReceived(data.braille || ""); // Update Braille output
      } else {
        console.warn("No braille output received from the backend.");
      }
  
      // If there's an audio file name returned
      if (data.audio_file) {
        const audioResponse = await axios.get(`http://localhost:5000/api/audio/${data.audio_file}`, {
          responseType: "blob",
        });
        const audioUrl = URL.createObjectURL(audioResponse.data);
        onAudioReceived(audioUrl);
      } else {
        console.warn("No audio file received.");
      }
    } catch (err) {
      console.error("Error in handleVideoToTextAndBraille:", err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleTextToAudio = async () => {
    if (!textInput.trim()) {
      alert("Please enter text for conversion.");
      return;
    }
  
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      // Make a POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/text-to-audio",
        { text: textInput.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const { audio_file } = response.data;
  
      if (audio_file) {
        // Fetch the actual audio file
        const audioResponse = await axios.get(`http://localhost:5000/api/audio/${audio_file}`, {
          responseType: "blob",
        });
        
        const audioUrl = URL.createObjectURL(audioResponse.data);
        onAudioReceived(audioUrl); // Pass the audio URL to the parent component
      } else {
        console.warn("No audio file received from the backend.");
        setErrorMessage("No audio file received.");
      }
    } catch (err) {
      console.error("Error in handleTextToAudio:", err);
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleTextToBraille = async () => {
    const trimmedText = textInput.trim();
    if (!trimmedText) {
      alert("Please enter text for conversion.");
      return;
    }

    await handleJsonRequest(
      { text: trimmedText },
      "http://localhost:5000/api/text-to-braille",
      (data) => onBrailleReceived(data.braille)
    );
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
    <div
      style={{ fontFamily: "Arial, sans-serif", margin: "2rem", maxWidth: "600px" }}
      aria-label="EduAccess Upload Form"
    >
      <h2 style={{ textAlign: "center", color: "#333" }} aria-label="Upload and Convert Header">
        EduAccess: Upload and Convert
      </h2>
      {errorMessage && (
        <div
          style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", marginBottom: "1rem", borderRadius: "5px" }}
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}

      {/* Text Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="text-section">
        <h3 id="text-section">1. Text Input</h3>
        <label htmlFor="text-area" style={{ display: "none" }}>
          Enter text for conversion
        </label>
        <textarea
          id="text-area"
          aria-label="Enter text for conversion"
          rows="5"
          cols="50"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter or upload text for conversion"
          disabled={isLoading}
          style={{ width: "100%" }}
        />
        <br />
        <label htmlFor="text-file" style={{ display: "none" }}>
          Upload a text file
        </label>
        <input
          id="text-file"
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setTextFile(e.target.files[0])}
          disabled={isLoading}
          aria-label="Upload a text file"
        />
        <button onClick={handleTextFileUpload} disabled={isLoading} aria-label="Extract Text Button">
          {isLoading ? "Extracting Text..." : "Upload and Extract Text"}
        </button>
        <button onClick={handleTextToAudio} disabled={isLoading} aria-label="Convert Text to Audio Button">
          {isLoading ? "Converting to Audio..." : "Convert Text to Audio"}
        </button>
        <button onClick={handleTextToBraille} disabled={isLoading} aria-label="Convert Text to Braille Button">
          {isLoading ? "Converting to Braille..." : "Convert Text to Braille"}
        </button>
      </div>

      {/* Image Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="image-section">
        <h3 id="image-section">2. Image Upload</h3>
        <label htmlFor="image-file" style={{ display: "none" }}>
          Upload an image file
        </label>
        <input
          id="image-file"
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
        <button onClick={handleAnalyzeImage} disabled={isLoading} aria-label="Analyze Image Button">
          {isLoading ? "Analyzing Image..." : "Analyze Image"}
        </button>
      </div>

      {/* Video Upload Section */}
      <div style={{ marginBottom: "1.5rem" }} aria-labelledby="video-section">
        <h3 id="video-section">3. Video Upload</h3>
        <label htmlFor="video-file" style={{ display: "none" }}>
          Upload a video file
        </label>
        <input
          id="video-file"
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
        <button onClick={handleVideoToAudio} disabled={isLoading} aria-label="Convert Video to Audio Button">
          {isLoading ? "Converting Video..." : "Convert Video to Audio"}
        </button>
        <button
          onClick={handleVideoToTextAndBraille}
          disabled={isLoading}
          aria-label="Convert Video to Text and Braille Button"
        >
          {isLoading ? "Processing Video..." : "Convert Video to Text and Braille"}
        </button>
      </div>

      <button onClick={handleReset} disabled={isLoading} style={{ backgroundColor: "#ff4d4d", color: "#fff" }}>
        Reset Form
      </button>
    </div>
  );
};

export default UploadForm;