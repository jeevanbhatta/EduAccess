import React, { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [brailleText, setBrailleText] = useState("");
  const [caption, setCaption] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [captionLabel, setCaptionLabel] = useState(""); // New state for dynamic label

  // Retain image details for future use
  const [imageDetails, setImageDetails] = useState({
    tags: [],
    categories: [],
    objects: [],
  });

  // Handler to update Braille output
  const handleBrailleReceived = (braille) => {
    setBrailleText(braille);
  };

  // Handler to update Audio output
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  // Handler to update caption, confidence, and label dynamically
  const handleTextReceived = (text, details = {}, label = "Output") => {
    setCaption(text || "No caption available");
    setConfidence(details.confidence || 0);
    setCaptionLabel(label); // Set the label dynamically
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
      {/* Header Section */}
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

      {/* Upload Form */}
      <main>
        <UploadForm
          onAudioReceived={handleAudioReceived}
          onBrailleReceived={handleBrailleReceived}
          onTextReceived={(text, details, label) =>
            handleTextReceived(text, details, label)
          }
        />
      </main>

      {/* Display Caption Output */}
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
          <h2
            id="caption-section"
            style={{ fontSize: "1.8rem", color: "#333" }}
            tabIndex="0"
            aria-label={`${captionLabel} Section`}
          >
            {captionLabel}
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
            aria-label={`${captionLabel}: ${caption} ${
              confidence > 0 ? `with confidence of ${confidence.toFixed(2)}` : ""
            }`}
            tabIndex="0"
          >
            {caption}
            {confidence > 0 ? ` (Confidence: ${confidence.toFixed(2)})` : ""}
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
          <h2
            id="audio-section"
            style={{ fontSize: "1.8rem", color: "#333" }}
            tabIndex="0"
            aria-label="Audio File Section"
          >
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
            tabIndex="0"
          >
            Your browser does not support the audio element.
          </audio>
        </section>
      )}

      {/* Display Braille Output */}
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
          <h2
            id="braille-section"
            style={{ fontSize: "1.8rem", color: "#333" }}
            tabIndex="0"
            aria-label="Braille Output Section"
          >
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
            tabIndex="0"
          >
            {brailleText}
          </pre>
        </section>
      )}
    </div>
  );
}

export default App;