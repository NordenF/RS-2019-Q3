const { keyboard } = require('./keyboardInstance');

document.addEventListener('DOMContentLoaded', () => {
  const main = document.createElement('main');
  main.classList.add('content');

  const label = document.createElement('label');
  label.textContent = 'Test field:';
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  textarea.id = 'textarea';
  label.setAttribute('for', 'textarea');
  textarea.addEventListener('keydown', (ev) => {
    ev.preventDefault();
  });

  main.appendChild(label);
  main.appendChild(textarea);
  main.appendChild(keyboard.getElement());

  const onPress = (symbol) => {
    textarea.focus();
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    const linesLengths = textarea.value.split('\n')
      .map((line) => line.length + 1);
    let lengthFromBegin = 0;
    let lineIndex = 0;
    let positionInLine = 0;
    for (let i = 0; i < linesLengths.length; i += 1) {
      lengthFromBegin += (linesLengths[i]);
      if ((start + 1) <= lengthFromBegin) {
        lineIndex = i;
        positionInLine = linesLengths[i] - (lengthFromBegin - start);
        break;
      }
    }
    switch (symbol) {
      case '\x7f':
        if (start === end) {
          if (textarea.value.length > start) {
            const nextSymbol = start + 1;
            textarea.selectionStart = nextSymbol;
            textarea.selectionEnd = nextSymbol;
          } else {
            break;
          }
        }
        document.execCommand('delete');
        break;
      case '\b':
        document.execCommand('delete');
        break;
      case '←':
        start = start > 0 ? start - 1 : start;
        end = start;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
        break;
      case '→':
        end = end < textarea.value.length ? end + 1 : end;
        start = end;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
        break;
      case '↑':
        if (lineIndex === 0) {
          break;
        }
        start -= positionInLine;
        if (linesLengths[lineIndex - 1] > positionInLine) {
          start -= (linesLengths[lineIndex - 1] - positionInLine);
        } else {
          start -= 1;
        }
        end = start;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
        break;
      case '↓':
        if (lineIndex >= linesLengths.length - 1) {
          break;
        }
        end += (linesLengths[lineIndex] - positionInLine);
        end += (linesLengths[lineIndex + 1] > positionInLine
          ? positionInLine : linesLengths[lineIndex + 1]);
        start = end;
        textarea.selectionStart = start;
        textarea.selectionEnd = end;
        break;
      default:
        document.execCommand('insertText', true, symbol);
    }
  };
  keyboard.setPressListener(onPress);

  document.addEventListener('keydown', (e) => {
    keyboard.keyDown(e);
  });

  document.addEventListener('keyup', (e) => {
    keyboard.keyUp(e);
  });

  document.addEventListener('mousedown', (e) => {
    keyboard.mousedown(e);
  });

  const languageSwitcher = document.createElement('button');
  languageSwitcher.textContent = 'ru ↔ en';
  languageSwitcher.classList.add('language-switcher');
  main.appendChild(languageSwitcher);

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(main);

  languageSwitcher.addEventListener('click', () => {
    keyboard.switch();
  });
});
