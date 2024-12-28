import os
from dotenv import load_dotenv
from azure.cognitiveservices.speech import SpeechConfig, AudioConfig, SpeechRecognizer

load_dotenv()

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

def convert_audio_to_text(audio_file_path):
    """
    Converts an audio file into text using Azure Speech-to-Text API.
    """
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech key or region not found in environment variables")

    # Set up the speech config
    speech_config = SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    audio_config = AudioConfig(filename=audio_file_path)
    speech_recognizer = SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    # Perform speech recognition
    result = speech_recognizer.recognize_once()

    if result.reason == result.Reason.RecognizedSpeech:
        return result.text
    elif result.reason == result.Reason.NoMatch:
        raise ValueError("No speech recognized in the audio file.")
    else:
        raise Exception(f"Speech-to-text failed: {result.reason}")
