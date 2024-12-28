import React, { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [brailleText, setBrailleText] = useState("");

  // Handler to set the Braille text
  const handleBrailleReceived = (braille) => {
    setBrailleText(braille);
  };

  // Handler to set the audio file
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  return (
    <div
      style={{
        margin: "2rem",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      {/* Main App Header */}
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#007bff",
          }}
        >
          EduAccess
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#555",
          }}
        >
          Accessible solutions for visually impaired individuals.
        </p>
      </header>

      {/* Upload Form Component */}
      <main>
        <UploadForm
          onAudioReceived={handleAudioReceived}
          onBrailleReceived={handleBrailleReceived}
        />
      </main>

      {/* Display Audio File */}
      <section
        aria-live="polite"
        aria-labelledby="audio-section"
        style={{
          marginTop: audioFile ? "2rem" : "0",
          backgroundColor: "#f9f9f9",
          padding: audioFile ? "1rem" : "0",
          borderRadius: "8px",
          border: audioFile ? "1px solid #ddd" : "none",
          display: audioFile ? "block" : "none",
        }}
      >
        {audioFile && (
          <>
            <h2 id="audio-section" style={{ fontSize: "1.8rem", color: "#333" }}>
              Audio File
            </h2>
            <audio
              controls
              src={`http://localhost:5000/api/audio/${audioFile}`}
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </>
        )}
      </section>

      {/* Display Braille Output */}
      <section
        aria-live="polite"
        aria-labelledby="braille-section"
        style={{
          marginTop: brailleText ? "2rem" : "0",
          backgroundColor: "#f9f9f9",
          padding: brailleText ? "1rem" : "0",
          borderRadius: "8px",
          border: brailleText ? "1px solid #ddd" : "none",
          display: brailleText ? "block" : "none",
        }}
      >
        {brailleText && (
          <>
            <h2 id="braille-section" style={{ fontSize: "1.8rem", color: "#333" }}>
              Braille Output
            </h2>
            <pre
              style={{
                fontSize: "1.5rem",
                backgroundColor: "#fff",
                padding: "10px",
                whiteSpace: "pre-wrap", // Preserve spacing
                wordWrap: "break-word",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginTop: "1rem",
              }}
            >
              {brailleText}
            </pre>
          </>
        )}
      </section>
    </div>
  );
}

export default App;