def convert_text_to_braille(text):
    """
    Convert a given text into a Braille representation while preserving formatting,
    such as line breaks and paragraph spacing.
    """
    # Mapping for Braille characters
    braille_map = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
        'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
        'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
        'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
        'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
        'z': '⠵',
        '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲',
        '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
        ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲', '!': '⠖',
        '(': '⠶', ')': '⠶', '?': '⠦', '-': '⠤', ' ': ' ',
        '\'': '⠄', '\"': '⠐', '/': '⠌', '\\': '⠸', '@': '⠈',
        '#': '⠼', '$': '⠫', '%': '⠩', '&': '⠯', '*': '⠡',
        '+': '⠬', '=': '⠿', '<': '⠣', '>': '⠜', '^': '⠘',
        '_': '⠸', '`': '⠈', '{': '⠷', '}': '⠾', '[': '⠪',
        ']': '⠻', '|': '⠳', '~': '⠴'
    }

    # Split text into lines
    lines = text.splitlines()

    braille_lines = []
    for line in lines:
        braille_line = []
        for char in line:
            if char.lower() in braille_map:
                braille_line.append(braille_map[char.lower()])
            else:
                # Append unknown characters as-is
                braille_line.append(char)
        braille_lines.append("".join(braille_line))

    # Join Braille lines with a newline character
    return "\n".join(braille_lines)