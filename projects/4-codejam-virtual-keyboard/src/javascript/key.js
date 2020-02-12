class Key {
  constructor(titlesMap, symbolsMap, upperSymbolsMap, isLetterMap, code, className = null) {
    this.titlesMap = titlesMap;
    this.symbolsMap = symbolsMap;
    this.upperSymbolsMap = upperSymbolsMap;
    this.isLetterMap = isLetterMap;
    this.code = code;
    this.className = className;
    this.element = document.createElement('button');
    this.element.classList.add('keyboard__btn');
    this.element.classList.add(this.className);
    this.switch('ru');
  }

  get symbol() {
    return this.symbolsMap[this.language];
  }

  get upperSymbol() {
    return this.upperSymbolsMap[this.language];
  }

  get isLetter() {
    return this.isLetterMap[this.language];
  }

  press() {
    this.element.classList.add('pressed');
  }

  unpress() {
    this.element.classList.remove('pressed');
  }

  getElement() {
    return this.element;
  }

  switch(language) {
    this.language = language;
    this.element.textContent = this.titlesMap[this.language];
    this.element.classList.toggle('letter', this.isLetterMap[this.language]);
  }
}

module.exports = {
  Key,
};
