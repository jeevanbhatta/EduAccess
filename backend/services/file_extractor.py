import os
from pdfminer.high_level import extract_text
from docx import Document

def extract_text_from_file(file_path):
    """
    Extract text from a file (.txt, .pdf, or .docx).
    """
    _, file_extension = os.path.splitext(file_path)

    if file_extension == '.txt':
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    elif file_extension == '.pdf':
        return extract_text(file_path)
    elif file_extension == '.docx':
        doc = Document(file_path)
        return '\n'.join([p.text for p in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format")
