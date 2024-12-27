import os
from moviepy.editor import VideoFileClip

def extract_audio_from_video(file):
    output_path = f"./static/audio/{file.filename.split('.')[0]}.mp3"
    video = VideoFileClip(file.filename)
    video.audio.write_audiofile(output_path)
    return output_path
