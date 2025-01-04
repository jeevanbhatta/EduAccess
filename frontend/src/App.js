import React, { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [brailleText, setBrailleText] = useState("");
  const [caption, setCaption] = useState("");
  const [confidence, setConfidence] = useState(0);

  // We retain these in case you decide to expand image details in the future
  const [imageDetails, setImageDetails] = useState({
    tags: [],
    categories: [],
    objects: [],
  });

  // Handler to set Braille text (used for both text-based and image-based braille)
  const handleBrailleReceived = (braille) => {
    setBrailleText(braille);
  };

  // Handler to set the audio file
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  // Handler to set the caption text and confidence (plus any future details)
  const handleTextReceived = (text, details = {}) => {
    setCaption(text || "No caption available");
    setConfidence(details.confidence || 0);
    // Update imageDetails if you want to store more info
    setImageDetails({
      tags: details.tags || [],
      categories: details.categories || [],
      objects: details.objects || [],
    });
  };

  return (
    <div
      style={{
        margin: "2rem",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#007bff",
          }}
          aria-label="EduAccess Main Header"
        >
          EduAccess
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#555",
          }}
          aria-label="EduAccess Subtitle"
        >
          Accessible solutions for visually impaired individuals.
        </p>
      </header>

      <main>
        <UploadForm
          onAudioReceived={handleAudioReceived}
          onBrailleReceived={handleBrailleReceived}
          onTextReceived={(text, details) => handleTextReceived(text, details)}
        />
      </main>

      {/* Display Extracted Caption */}
      {caption && (
        <section
          aria-live="polite"
          aria-labelledby="caption-section"
          style={{
            marginTop: "2rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h2 id="caption-section" style={{ fontSize: "1.8rem", color: "#333" }}>
            Image Caption
          </h2>
          <p
            style={{
              fontSize: "1.5rem",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginTop: "1rem",
            }}
            aria-label="Caption Text"
          >
            {caption} (Confidence: {confidence.toFixed(2)})
          </p>
        </section>
      )}

      {/* Display Audio File */}
      {audioFile && (
        <section
          aria-live="polite"
          aria-labelledby="audio-section"
          style={{
            marginTop: "2rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h2 id="audio-section" style={{ fontSize: "1.8rem", color: "#333" }}>
            Audio File
          </h2>
          <audio
            controls
            src={audioFile}
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            aria-label="Audio Playback"
          >
            Your browser does not support the audio element.
          </audio>
        </section>
      )}

      {/* Display Braille Output (for either text or image caption) */}
      {brailleText && (
        <section
          aria-live="polite"
          aria-labelledby="braille-section"
          style={{
            marginTop: "2rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h2 id="braille-section" style={{ fontSize: "1.8rem", color: "#333" }}>
            Braille Output
          </h2>
          <pre
            style={{
              fontSize: "1.5rem",
              backgroundColor: "#fff",
              padding: "10px",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginTop: "1rem",
            }}
            aria-label="Braille Text"
          >
            {brailleText}
          </pre>
        </section>
      )}
    </div>
  );
}

export default App;