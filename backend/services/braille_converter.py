def convert_text_to_braille(text):
    """
    Convert a given text into a rudimentary Braille representation while preserving spaces,
    line breaks, and other formatting for better organization.
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

    # Convert text character by character while preserving structure
    braille_result = []
    for line in text.splitlines():  # Process each line separately
        braille_line = []
        for char in line:
            if char.lower() in braille_map:
                braille_line.append(braille_map[char.lower()])
            else:
                # If no mapping is found, append the original character
                braille_line.append(char)
        # Join the Braille characters for the line and add it to the result
        braille_result.append("".join(braille_line))

    # Join lines with a new line character to preserve line breaks
    return "\n\n".join(braille_result)  # Add double line breaks for paragraph separation