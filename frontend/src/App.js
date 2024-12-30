import React, { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [brailleText, setBrailleText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [imageDetails, setImageDetails] = useState({ tags: [], categories: [], objects: [] });

  // Handler to set the Braille text
  const handleBrailleReceived = (braille) => {
    setBrailleText(braille);
  };

  // Handler to set the audio file
  const handleAudioReceived = (audio) => {
    setAudioFile(audio);
  };

  // Handler to set the extracted text and additional details
  const handleTextReceived = (text, details = {}) => {
    setExtractedText(text);
    setImageDetails(details);
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
          onTextReceived={handleTextReceived}
        />
      </main>

      {/* Display Extracted Text and Details */}
      {(extractedText || imageDetails.tags.length > 0 || imageDetails.categories.length > 0 || imageDetails.objects.length > 0) && (
        <section
          aria-live="polite"
          aria-labelledby="text-section"
          style={{
            marginTop: "2rem",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          {extractedText && (
            <>
              <h2 id="text-section" style={{ fontSize: "1.8rem", color: "#333" }}>
                Extracted Text
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
              >
                {extractedText}
              </pre>
            </>
          )}
          {(imageDetails.tags.length > 0 || imageDetails.categories.length > 0 || imageDetails.objects.length > 0) && (
            <>
              <h2 style={{ fontSize: "1.8rem", color: "#333", marginTop: "1rem" }}>
                Image Analysis Details
              </h2>
              {imageDetails.tags.length > 0 && (
                <div>
                  <h3>Tags</h3>
                  <ul
                    style={{
                      fontSize: "1.2rem",
                      listStyleType: "disc",
                      marginLeft: "20px",
                      color: "#555",
                    }}
                  >
                    {imageDetails.tags.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                  </ul>
                </div>
              )}
              {imageDetails.categories.length > 0 && (
                <div>
                  <h3>Categories</h3>
                  <ul
                    style={{
                      fontSize: "1.2rem",
                      listStyleType: "disc",
                      marginLeft: "20px",
                      color: "#555",
                    }}
                  >
                    {imageDetails.categories.map((category, index) => (
                      <li key={index}>{category.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {imageDetails.objects.length > 0 && (
                <div>
                  <h3>Objects</h3>
                  <ul
                    style={{
                      fontSize: "1.2rem",
                      listStyleType: "disc",
                      marginLeft: "20px",
                      color: "#555",
                    }}
                  >
                    {imageDetails.objects.map((object, index) => (
                      <li key={index}>{object.object}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
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
          >
            {brailleText}
          </pre>
        </section>
      )}
    </div>
  );
}

export default App;