import os
from flask import Flask, request, jsonify, send_from_directory
from flask import send_file
from flask_cors import CORS
from dotenv import load_dotenv
from services.text_to_speech import convert_text_to_speech

from services.text_to_speech import convert_text_to_speech
from services.video_to_audio import convert_video_to_audio
from services.braille_converter import convert_text_to_braille

app = Flask(__name__)
CORS(app)

# Load environment variables from .env
load_dotenv()

# Directory to store audio files
AUDIO_DIR = os.path.join(os.getcwd(), "backend", "static", "audio")

# Ensure the audio directory exists
os.makedirs(AUDIO_DIR, exist_ok=True)


@app.route("/")
def index():
    return "EduAccess Backend is Running!"


@app.route("/api/text-to-audio", methods=["POST"])
def api_text_to_audio():
    """
    Convert uploaded text content to audio using Azure TTS
    """
    text = request.form.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        output_filename = convert_text_to_speech(text, AUDIO_DIR)
        return jsonify({"audio_file": output_filename})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/video-to-audio", methods=["POST"])
def api_video_to_audio():
    """
    Convert uploaded video file to audio
    """
    if "videoFile" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video_file = request.files["videoFile"]
    if video_file.filename == "":
        return jsonify({"error": "Video filename is empty"}), 400

    try:
        output_filename = convert_video_to_audio(video_file, AUDIO_DIR)
        return jsonify({"audio_file": output_filename})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/text-to-braille", methods=["POST"])
def api_text_to_braille():
    """
    Convert text to a braille representation
    """
    text = request.form.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        braille_text = convert_text_to_braille(text)
        return jsonify({"braille": braille_text})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/audio/<path:filename>", methods=["GET"])
def download_audio(filename):
    """
    Download or stream the audio file
    """
    # Return the file from the audio directory
    return send_from_directory(AUDIO_DIR, filename, as_attachment=False)


if __name__ == "__main__":
    # You can bind to a port from an environment variable in production
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
