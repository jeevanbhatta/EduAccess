import os
import uuid
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk

load_dotenv()

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")


def convert_text_to_speech(text, audio_dir):
    """
    Converts text to an audio file using Azure Cognitive Services.
    Returns the filename of the generated audio.
    """
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        raise ValueError("Azure Speech key or region not found in environment variables")

    # Initialize speech config
    speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
    # You can change the voice name as needed
    speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

    # Create a unique filename
    filename = f"tts_output_{uuid.uuid4().hex}.wav"
    file_path = os.path.join(audio_dir, filename)

    audio_config = speechsdk.audio.AudioConfig(filename=file_path)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    # Synchronously synthesize speech from text
    result = synthesizer.speak_text_async(text).get()
    if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        raise Exception("Text-to-speech synthesis failed")

    return filename