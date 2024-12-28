def convert_text_to_braille(text):
    """
    Convert a given text into a Braille representation while preserving formatting,
    such as line breaks and paragraph spacing.
    """
    if not text or not isinstance(text, str):
        raise ValueError("Invalid text input. Please provide non-empty string data.")

    # Mapping for Braille characters
    braille_map = {
        # Lowercase letters
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
        'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
        'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
        'z': '⠵',
        
        # Uppercase letters (preceded by capitalization marker)
        'A': '⠠⠁', 'B': '⠠⠃', 'C': '⠠⠉', 'D': '⠠⠙', 'E': '⠠⠑',
        'F': '⠠⠋', 'G': '⠠⠛', 'H': '⠠⠓', 'I': '⠠⠊', 'J': '⠠⠚',
        'K': '⠠⠅', 'L': '⠠⠇', 'M': '⠠⠍', 'N': '⠠⠝', 'O': '⠠⠕',
        'P': '⠠⠏', 'Q': '⠠⠟', 'R': '⠠⠗', 'S': '⠠⠎', 'T': '⠠⠞',
        'U': '⠠⠥', 'V': '⠠⠧', 'W': '⠠⠺', 'X': '⠠⠭', 'Y': '⠠⠽',
        'Z': '⠠⠵',
        
        # Numbers
        '0': '⠼⠚', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙',
        '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
        
        # Common punctuation
        ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲', '!': '⠖',
        '(': '⠶', ')': '⠶', '?': '⠦', '-': '⠤', ' ': ' ',
        '\'': '⠄', '\"': '⠐', '/': '⠌', '\\': '⠸', '@': '⠈',
        '#': '⠼', '$': '⠫', '%': '⠩', '&': '⠯', '*': '⠡',
        '+': '⠬', '=': '⠿', '<': '⠣', '>': '⠜', '^': '⠘',
        '_': '⠸', '`': '⠈', '{': '⠷', '}': '⠾', '[': '⠪',
        ']': '⠻', '|': '⠳', '~': '⠴',

        # Mathematical symbols
        '+': '⠬', '-': '⠤', '*': '⠔', '/': '⠌', '=': '⠿',
        '<': '⠣', '>': '⠜', '±': '⠖', '∞': '⠼', '√': '⠣',
        '∑': '⠬', 'π': '⠏',
    }

    # Split text into lines
    lines = text.splitlines()

    braille_lines = []
    for line in lines:
        braille_line = []
        for char in line:
            if char in braille_map:
                braille_line.append(braille_map[char])
            else:
                # Append unknown characters as-is
                braille_line.append(char)
        braille_lines.append("".join(braille_line))

    # Join Braille lines with a newline character
    return "\n".join(braille_lines)