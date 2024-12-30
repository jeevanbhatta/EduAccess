import os
import base64
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
import requests
from services.braille_converter import convert_text_to_braille
from services.text_to_speech import convert_text_to_speech

# Load environment variables
load_dotenv()
AZURE_IMAGE_API_KEY = os.getenv("AZURE_IMAGE_API_KEY")
AZURE_IMAGE_ENDPOINT = os.getenv("AZURE_IMAGE_ENDPOINT")

def analyze_image_base64(image_data, max_candidates=5):
    if not AZURE_IMAGE_API_KEY:
        raise ValueError("Azure Image API key is not set.")
    if not AZURE_IMAGE_ENDPOINT:
        raise ValueError("Azure Image endpoint is not set.")

    # Ensure image_data is in bytes
    if isinstance(image_data, str):
        try:
            image_data = base64.b64decode(image_data.split(",")[-1])
        except Exception as e:
            raise ValueError("Failed to decode Base64 image data.") from e

    # Validate the image
    try:
        Image.open(BytesIO(image_data)).verify()
    except Exception:
        raise ValueError("The provided data is not a valid image.")

    # Prepare headers and parameters
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_IMAGE_API_KEY,
        "Content-Type": "application/octet-stream",
    }
    params = {
        "visualFeatures": "Description,Tags,Categories,Objects",
        "language": "en",
        "maxCandidates": max_candidates,
    }

    # Send the request to Azure
    response = requests.post(AZURE_IMAGE_ENDPOINT.rstrip('/') + "/analyze", headers=headers, params=params, data=image_data)
    if response.status_code != 200:
        try:
            error_details = response.json()
        except ValueError:
            error_details = response.text
        raise Exception(f"Image analysis failed with status {response.status_code}: {error_details}")

    return response.json()

def process_image(image_data, audio_dir, max_candidates=5):
    if not image_data:
        raise ValueError("Image data is empty.")

    # Analyze the image
    analysis = analyze_image_base64(image_data, max_candidates)

    # Extract description
    description = analysis.get("description", {}).get("captions", [{}])[0].get("text", "No description available")

    # Convert description to Braille and audio
    braille_text = convert_text_to_braille(description)
    audio_file = convert_text_to_speech(description, audio_dir)

    return {
        "text": description,
        "braille": braille_text,
        "audio": audio_file,
        "tags": [tag.get("name") for tag in analysis.get("tags", [])],
        "categories": [category.get("name") for category in analysis.get("categories", [])],
        "objects": [
            {
                "object": obj.get("object"),
                "confidence": obj.get("confidence"),
                "rectangle": obj.get("rectangle"),
            }
            for obj in analysis.get("objects", [])
        ],
    }