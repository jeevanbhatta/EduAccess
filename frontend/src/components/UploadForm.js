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
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result;
  
        const response = await fetch("http://localhost:5000/api/analyze-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: imageData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error analyzing image:", errorData);
          alert("Error analyzing image: " + errorData.error);
          return;
        }
  
        const data = await response.json();
        console.log("Image analysis result:", data);
  
        // Display meaningful results in the frontend
        if (data.text) {
          onTextReceived(data.text); // Update the display in the UI
        } else {
          alert("No meaningful description generated.");
        }
      };
  
      reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("Error reading file. Please try again.");
      };
  
      reader.readAsArrayBuffer(imageFile);
    } catch (error) {
      console.error("Error in handleAnalyzeImage:", error);
      alert("An unexpected error occurred while analyzing the image.");
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
      setErrorMessage(""); // Clear any previous errors

      const response = await axios.post("http://localhost:5000/api/video-to-audio", formData, {
        responseType: "blob", // Expect a binary file as the response
        headers: { "Content-Type": "multipart/form-data" },
      });

      const audioUrl = URL.createObjectURL(response.data); // Create a URL for the audio blob
      onAudioReceived(audioUrl); // Pass the URL to the audio player
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
      setErrorMessage(""); // Clear any previous errors

      const response = await axios.post(
        "http://localhost:5000/api/video-to-text-and-braille",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;
      setTextInput(data.text || ""); // Set the extracted text in the text input
      onBrailleReceived(data.braille || ""); // Update Braille output
      if (data.audio_file) {
        const audioResponse = await axios.get(`http://localhost:5000/api/audio/${data.audio_file}`, {
          responseType: "blob",
        });
        const audioUrl = URL.createObjectURL(audioResponse.data);
        onAudioReceived(audioUrl); // Pass the URL to the audio player
      } else {
        console.warn("No audio file received.");
      }

      if (data.text) {
        onTextReceived(data.text); // Pass the text to be displayed in a dedicated section
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

    await handleJsonRequest(
      { text: textInput.trim() },
      "http://localhost:5000/api/text-to-audio",
      (data) => onAudioReceived(data.audio_file)
    );
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
        <button onClick={handleVideoToTextAndBraille} disabled={isLoading}>
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