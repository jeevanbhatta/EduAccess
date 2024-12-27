import os
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer, AudioConfig

def convert_text_to_speech(file):
    speech_config = SpeechConfig(subscription="YOUR_AZURE_KEY", region="YOUR_AZURE_REGION")
    output_path = f"./static/audio/{file.filename.split('.')[0]}.mp3"
    audio_config = AudioConfig(filename=output_path)

    with open(file, 'r') as text_file:
        text = text_file.read()

    synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    synthesizer.speak_text_async(text)
    return output_path
