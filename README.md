# EduAccess

**EduAccess** is a platform that makes educational materials accessible for blind and visually impaired individuals. It converts text and video content into audio or Braille formats, empowering users with greater access to knowledge and learning resources.

---

## Features

- **Text-to-Audio Conversion**: Upload text files and convert them into high-quality audio using Azure Cognitive Services.
- **Video-to-Audio Conversion**: Extract audio from videos, making educational and tutorial content accessible.
- **Text-to-Braille Conversion**: Convert text materials into Braille-compatible files for printing or use with refreshable Braille displays.
- **Accessible User Interface**: Designed to work seamlessly with screen readers and keyboard navigation.

---

## Project Structure

```
EduAccess/
│
├── backend/
│   ├── app.py                # Flask backend
│   ├── requirements.txt      # Backend dependencies
│   ├── services/
│   │   ├── text_to_speech.py # Text-to-speech service
│   │   ├── video_to_audio.py # Video-to-audio extraction service
│   │   ├── braille_converter.py # Braille conversion service
│   └── static/
│       └── audio/            # Directory for storing audio files
│
├── frontend/
│   ├── public/
│   │   ├── index.html        # Main HTML file
│   ├── src/
│   │   ├── App.js            # React app entry point
│   │   ├── components/
│   │   │   ├── UploadForm.js # File upload component
│   │   │   ├── Player.js     # Audio player component
│   └── package.json          # Frontend dependencies
│
└── README.md                 # Documentation
```

---

## Setup

### Backend

1. Navigate to the `backend/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

## Azure Configuration

1. Create a **Cognitive Services** resource in Azure.
2. Obtain your API key and region.
3. Update the `text_to_speech.py` script with your Azure API key and region:
   ```python
   speech_config = SpeechConfig(subscription="YOUR_AZURE_KEY", region="YOUR_AZURE_REGION")
   ```

---

## Usage

1. **Start the Backend Server**: 
   - Ensure the Flask server is running locally.
2. **Start the Frontend**: 
   - Access the React app via your browser (default: `http://localhost:3000`).
3. **Upload Files**:
   - Select a text or video file to convert.
   - Choose the desired output format: audio or Braille.
4. **Download Processed Files**:
   - Once the file is processed, download it via the provided link.

---

## Example Workflows

### Text-to-Audio Conversion
1. Upload a `.txt` file.
2. The system generates an `.mp3` file using Azure Text-to-Speech.
3. Download the audio file and listen to it offline.

### Video-to-Audio Conversion
1. Upload a `.mp4` or `.mov` file.
2. The system extracts the audio and saves it as an `.mp3`.
3. Download the audio to access the content.

### Text-to-Braille Conversion
1. Upload a `.txt` file.
2. The system generates a `.brf` file with Braille encoding.
3. Use the file with a Braille printer or display.

---

## Dependencies

### Backend
- **Flask**: Web framework for the backend.
- **Azure Cognitive Services SDK**: For Text-to-Speech and Speech-to-Text features.
- **MoviePy**: For extracting audio from videos.
- **Liblouis**: Open-source Braille transcription library (if available).

### Frontend
- **React**: Frontend library for building the user interface.
- **HTML/CSS**: For accessibility-focused design.

---

## Future Enhancements

- **Real-Time Audio Streaming**: Stream audio for longer files without full conversion.
- **Multilingual Support**: Add translation features for global accessibility.
- **Enhanced Braille Formatting**: Support advanced Braille formats and layouts.
- **Cloud Deployment**: Scale the app for global use with Azure App Service.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing

We welcome contributions to enhance the project! Feel free to open issues or submit pull requests to the repository.

---

## Contact

For questions or support, reach out to the project maintainer at jeevanbhattacs@gmil.com.