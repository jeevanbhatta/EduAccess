import os
import requests
from dotenv import load_dotenv
from services.braille_converter import convert_text_to_braille

# Load environment variables
load_dotenv()

# Azure Vision API configurations
VISION_ENDPOINT = os.getenv("VISION_ENDPOINT")
VISION_KEY = os.getenv("VISION_KEY")

if not VISION_ENDPOINT or not VISION_KEY:
    raise ValueError("Missing environment variables 'VISION_ENDPOINT' or 'VISION_KEY'.")

HEADERS = {
    "Ocp-Apim-Subscription-Key": VISION_KEY,
    "Content-Type": "application/octet-stream",
}

# Updated the API version and added model-version to params for better caption results
PARAMS = {
    "features": "caption",
    "gender-neutral-caption": "true",
    "language": "en",
    "model-version": "latest",
}

def process_image(image_data, audio_dir):
    """
    Analyzes an image using Azure's REST API.
    Args:
        image_data: Raw image bytes to be analyzed.
        audio_dir: Directory to store any generated audio files.

    Returns:
        dict: Analysis results including caption, confidence, and braille_caption.
    """
    try:
        # Make the request to the Azure Vision API
        response = requests.post(
            url=f"{VISION_ENDPOINT.rstrip('/')}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview",
            headers=HEADERS,
            params=PARAMS,
            data=image_data
        )

        print(f"Raw Response: {response.status_code}, {response.text}")

        if response.status_code != 200:
            raise Exception(f"Image analysis failed with status {response.status_code}: {response.text}")

        result = response.json()

        caption_text = result.get("captionResult", {}).get("text", "No caption available")
        caption_confidence = result.get("captionResult", {}).get("confidence", 0.0)


        # Convert the caption text to braille
        braille_caption = convert_text_to_braille(caption_text)

        return {
            "caption": {
                "text": caption_text,
                "confidence": caption_confidence,
            },
            "braille_caption": braille_caption
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise Exception(f"Error processing image: {str(e)}")