import os
import uuid
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import requests
import base64
from io import BytesIO
from PIL import Image

# Load environment variables
load_dotenv()
AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")
AZURE_IMAGE_API_KEY = os.getenv("AZURE_IMAGE_API_KEY")
AZURE_IMAGE_ENDPOINT = os.getenv("AZURE_IMAGE_ENDPOINT") + "/v4.0/analyze"

def analyze_image_base64(base64_image):
    """
    Analyzes a Base64-encoded image using Azure Image Analysis API and extracts visual features.
    Returns the description and tags.
    """
    if not AZURE_IMAGE_API_KEY or not AZURE_IMAGE_ENDPOINT:
        raise ValueError("Azure Image Analysis key or endpoint not found in environment variables")

    # Decode the Base64 image to bytes
    image_data = base64.b64decode(base64_image)
    
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_IMAGE_API_KEY,
        "Content-Type": "application/octet-stream",
    }

    params = {
        "visualFeatures": "Description,Tags",
        "language": "en",
    }

    response = requests.post(AZURE_IMAGE_ENDPOINT, headers=headers, params=params, data=image_data)
    if response.status_code != 200:
        raise Exception(f"Image analysis failed: {response.text}")

    return response.json()


def convert_to_braille(text):
    """
    Converts plain text into Braille representation.
    """
    braille_map = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
        'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
        'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
        'z': '⠵', ' ': ' '
    }

    return ''.join(braille_map.get(char, char) for char in text.lower())

def convert_text_to_speech(text, audio_dir):
    """
    Converts text to an audio file using Azure Speech SDK.
    Returns the filename of the generated audio file.
    """
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech key or region not found in environment variables")

    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

    filename = f"tts_output_{uuid.uuid4().hex}.wav"
    file_path = os.path.join(audio_dir, filename)

    audio_config = speechsdk.audio.AudioConfig(filename=file_path)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    result = synthesizer.speak_text_async(text).get()
    if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        raise Exception("Text-to-speech synthesis failed")

    return filename

def process_image(base64_image, audio_dir):
    """
    Processes a Base64-encoded image and generates text, Braille, and audio outputs.
    """
    if not base64_image:
        raise ValueError("Base64 image is empty.")

    analysis = analyze_image_base64(base64_image)
    description = analysis.get("description", {}).get("captions", [{}])[0].get("text", "No description available")
    braille_text = convert_to_braille(description)
    audio_file = convert_text_to_speech(description, audio_dir)

    return {
        "text": description,
        "braille": braille_text,
        "audio": audio_file,
    }