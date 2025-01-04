import os
import uuid
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk

load_dotenv()

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")


def normalize_text(text):
    """
    Cleans up the input text by removing unwanted characters or whitespace.
    """
    return ' '.join(text.strip().split())


def convert_text_to_speech(text, audio_dir):
    """
    Converts text to an audio file using Azure Cognitive Services.
    Returns the filename of the generated audio.
    """
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech key or region not found in environment variables")

    if not text or not text.strip():
        raise ValueError("Input text is empty or invalid")

    # Normalize the input text
    text = normalize_text(text)

    # Initialize speech config
    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

    # Create a unique filename
    filename = f"tts_output_{uuid.uuid4().hex}.wav"
    file_path = os.path.join(audio_dir, filename)

    # Ensure the audio directory exists
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir, exist_ok=True)

    audio_config = speechsdk.audio.AudioConfig(filename=file_path)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    # Synchronously synthesize speech from text
    result = synthesizer.speak_text_async(text).get()

    # Debugging information
    print(f"Synthesis Result Reason: {result.reason}")
    if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        if result.error_details:
            print(f"Error details: {result.error_details}")
        raise Exception("Text-to-speech synthesis failed")

    # Verify that the file is successfully created
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        raise Exception("Audio file was not created or is empty")

    print(f"Audio file created: {file_path}")
    return filename
