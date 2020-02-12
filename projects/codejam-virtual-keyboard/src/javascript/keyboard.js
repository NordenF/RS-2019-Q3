class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.element = document.createElement('div');
    this.element.classList.add('keyboard');
    for (let i = 0; i < this.rows.length; i += 1) {
      this.element.appendChild(this.rows[i].getElement());
    }
    this.language = 'ru';
    this.isCapsLock = false;
  }

  get isCapsLock() {
    return this.isCapsLockFlag;
  }

  set isCapsLock(value) {
    this.element.classList.toggle('caps-lock', value);
    this.isCapsLockFlag = value;
  }

  keyDown(e) {
    if (e.altKey && e.shiftKey) {
      this.switch();
      e.preventDefault();
      return;
    }

    this.rows.forEach((row) => {
      row.keys.forEach((key) => {
        if (e.code === key.code) {
          key.press();
          if (key.code === 'CapsLock') {
            this.isCapsLock = !this.isCapsLock;
          } else {
            this.keyPress(key, e.shiftKey);
          }
          e.preventDefault();
        }
      });
    });
  }

  keyUp(e) {
    this.rows.forEach((row) => {
      row.keys.forEach((key) => {
        if (e.code === key.code) {
          key.unpress(e);
        }
      });
    });
  }

  mousedown(e) {
    this.rows.forEach((row) => {
      row.keys.forEach((key) => {
        if (e.target === key.element) {
          key.press();
          const $this = this;

          // eslint-disable-next-line no-inner-declarations
          function mouseUpListener() {
            if (key.code === 'CapsLock') {
              $this.isCapsLock = !$this.isCapsLock;
            } else {
              $this.keyPress(key, e.shiftKey);
            }
            key.unpress(e);
            document.removeEventListener('mouseup', mouseUpListener);
          }

          document.addEventListener('mouseup', mouseUpListener);
        }
      });
    });
  }

  keyPress(key, isShift) {
    if (!this.pressListener) {
      return;
    }

    let upper = false;
    if (isShift) {
      if (key.isLetter) {
        upper = !this.isCapsLock;
      } else {
        upper = true;
      }
    } else if (key.isLetter) {
      upper = this.isCapsLock;
    }

    this.pressListener(upper ? key.upperSymbol : key.symbol);
  }

  setPressListener(listener) {
    this.pressListener = listener;
  }

  getElement() {
    return this.element;
  }

  switch() {
    this.language = this.language === 'ru' ? 'en' : 'ru';
    this.rows.forEach((row) => {
      row.switch(this.language);
    });
  }
}

module.exports = {
  Keyboard,
};
