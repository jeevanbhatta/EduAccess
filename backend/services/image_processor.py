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