const MORSE_TABLE = {
    '.-':     'a',
    '-...':   'b',
    '-.-.':   'c',
    '-..':    'd',
    '.':      'e',
    '..-.':   'f',
    '--.':    'g',
    '....':   'h',
    '..':     'i',
    '.---':   'j',
    '-.-':    'k',
    '.-..':   'l',
    '--':     'm',
    '-.':     'n',
    '---':    'o',
    '.--.':   'p',
    '--.-':   'q',
    '.-.':    'r',
    '...':    's',
    '-':      't',
    '..-':    'u',
    '...-':   'v',
    '.--':    'w',
    '-..-':   'x',
    '-.--':   'y',
    '--..':   'z',
    '.----':  '1',
    '..---':  '2',
    '...--':  '3',
    '....-':  '4',
    '.....':  '5',
    '-....':  '6',
    '--...':  '7',
    '---..':  '8',
    '----.':  '9',
    '-----':  '0',
};

function decode(expr) {
    let letters = [];
    let digitPairNumber = 0;
    let currentLetterCode = "";
    for (let i = 0; i < expr.length; i += 2) {
        if (expr[i] === "*") {
            letters.push(" ");
            i += 8;
            continue;
        }
        if (expr[i] === "1") {
            currentLetterCode += ((expr[i + 1] === "0") ? "." : "-");
        }
        digitPairNumber++;
        if (digitPairNumber === 5) {
            letters.push(MORSE_TABLE[currentLetterCode]);
            currentLetterCode = "";
            digitPairNumber = 0;
        }
    }
    return letters.join("");
}

module.exports = {
    decode
};
