class GuessingGame {
    constructor() {}

    setRange(min, max) {
        this.min = min;
        this.max = max;
        this.calculateGuess();
    }

    calculateGuess() {
        this.currentGuess = Math.round((this.max + this.min) / 2);
    }

    guess() {
        return this.currentGuess;
    }

    lower() {
        this.max = this.currentGuess;
        this.calculateGuess();
    }

    greater() {
        this.min = this.currentGuess;
        this.calculateGuess();
    }
}

module.exports = GuessingGame;
