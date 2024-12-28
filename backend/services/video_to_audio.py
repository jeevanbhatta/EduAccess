import os
import uuid
from moviepy.editor import VideoFileClip
from .audio_to_text import convert_audio_to_text
from .braille_converter import convert_text_to_braille

def convert_video_to_text_and_braille(video_file, audio_dir):
    """
    Converts a video file to audio, then extracts text and braille.
    Returns a dictionary with audio file, text, and braille outputs.
    """
    # Generate a unique filename for the audio
    audio_filename = f"video_audio_{uuid.uuid4().hex}.mp3"
    audio_file_path = os.path.join(audio_dir, audio_filename)

    # Temporarily save the video file
    temp_video_path = os.path.join(audio_dir, f"temp_{uuid.uuid4().hex}_{video_file.filename}")
    video_file.save(temp_video_path)

    try:
        # Extract audio from the video
        clip = VideoFileClip(temp_video_path)
        audio = clip.audio
        audio.write_audiofile(audio_file_path)
        clip.close()

        # Convert audio to text
        text = convert_audio_to_text(audio_file_path)

        # Convert text to braille
        braille = convert_text_to_braille(text)

        return {
            "audio_file": audio_filename,
            "text": text,
            "braille": braille,
        }
    finally:
        # Clean up the temp video file
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)