import os
from dotenv import load_dotenv
from azure.cognitiveservices.speech import SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason

load_dotenv()

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

def convert_audio_to_text(audio_file_path):
    """
    Converts an audio file into text using Azure Speech-to-Text API.
    Supports both file paths and in-memory audio streams.
    """
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech key or region not found in environment variables")

    if not os.path.exists(audio_file_path):
        raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

    # Set up the Azure speech configuration
    speech_config = SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    speech_config.speech_recognition_language = "en-US"  # Customize language if needed

    # Configure the audio input
    audio_config = AudioConfig(filename=audio_file_path)

    # Initialize the speech recognizer
    speech_recognizer = SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    # Perform speech recognition
    result = speech_recognizer.recognize_once()

    if result.reason == ResultReason.RecognizedSpeech:
        # Return the recognized text
        return result.text.strip()
    elif result.reason == ResultReason.NoMatch:
        raise ValueError("No speech recognized in the audio file. Please try again with clearer audio.")
    else:
        raise Exception(f"Speech-to-text failed: {result.reason}. Error Details: {result.error_details}")