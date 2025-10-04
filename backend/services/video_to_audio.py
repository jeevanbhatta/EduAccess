import os
import uuid
from moviepy.editor import VideoFileClip
from .audio_to_text import convert_audio_to_text
from .braille_converter import convert_text_to_braille

def convert_video_to_audio_text_and_braille(video_file):
    """
    Converts a video file to audio, extracts text, and converts it to braille.
    Returns a dictionary with the path to the audio file, extracted text, and braille outputs.
    """
    temp_video_path = None
    temp_audio_path = None

    try:
        # Save the video file temporarily
        temp_video_path = f"/tmp/{uuid.uuid4().hex}.mp4"
        video_file.save(temp_video_path)

        # Extract audio from the video and save to a temporary file
        temp_audio_path = f"/tmp/{uuid.uuid4().hex}.wav"
        clip = VideoFileClip(temp_video_path)
        clip.audio.write_audiofile(temp_audio_path)  # Save audio as a file
        clip.close()

        # Convert the saved audio file to text
        text = convert_audio_to_text(temp_audio_path)

        # Convert the text to Braille
        braille = convert_text_to_braille(text)

        return {
            "audio_file_path": temp_audio_path,  # Return the path to the audio file
            "text": text,
            "braille": braille,
        }

    except Exception as e:
        raise Exception(f"Error in convert_video_to_audio_text_and_braille: {str(e)}")

    finally:
        # Clean up the temporary video file
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)

