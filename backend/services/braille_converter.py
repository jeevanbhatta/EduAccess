import os
from pylibdmtx import encode

def convert_text_to_braille(file):
    output_path = f"./static/audio/{file.filename.split('.')[0]}.brf"
    with open(file, 'r') as text_file:
        text = text_file.read()

    # Convert text to Braille (simplified example, actual Braille uses different encoding)
    braille_text = text.translate(str.maketrans("abcdefghijklmnopqrstuvwxyz", "⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵"))
    with open(output_path, 'w') as braille_file:
        braille_file.write(braille_text)
    return output_path
