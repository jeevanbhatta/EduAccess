from flask import Flask, request, jsonify, send_from_directory
from services.text_to_speech import convert_text_to_speech
from services.video_to_audio import extract_audio_from_video
from services.braille_converter import convert_text_to_braille

app = Flask(__name__)
UPLOAD_FOLDER = './static/audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    file_type = request.form.get('type')

    if file_type == 'text':
        output_path = convert_text_to_speech(file)
    elif file_type == 'video':
        output_path = extract_audio_from_video(file)
    elif file_type == 'braille':
        output_path = convert_text_to_braille(file)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    return jsonify({'output_path': output_path})

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
