class Row {
  constructor(keys) {
    this.keys = keys;
    this.element = document.createElement('div');
    this.element.classList.add('keyboard__row');
    for (let i = 0; i < this.keys.length; i += 1) {
      this.element.appendChild(this.keys[i].getElement());
    }
  }

  getElement() {
    return this.element;
  }

  switch(language) {
    this.keys.forEach((key) => {
      key.switch(language);
    });
  }
}

module.exports = {
  Row,
};
