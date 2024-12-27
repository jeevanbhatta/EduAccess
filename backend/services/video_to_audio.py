import os
import uuid
from moviepy.editor import VideoFileClip

def convert_video_to_audio(video_file, audio_dir):
    """
    Extracts the audio from the uploaded video file.
    Returns the filename of the generated audio.
    """
    # Generate a unique filename
    filename = f"video_audio_{uuid.uuid4().hex}.mp3"
    file_path = os.path.join(audio_dir, filename)

    # Temporarily store the video file before processing
    temp_video_path = os.path.join(audio_dir, f"temp_{uuid.uuid4().hex}_{video_file.filename}")
    video_file.save(temp_video_path)

    try:
        # Use moviepy to extract audio
        clip = VideoFileClip(temp_video_path)
        audio = clip.audio
        audio.write_audiofile(file_path)
        clip.close()

        return filename
    finally:
        # Clean up the temp video file
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
