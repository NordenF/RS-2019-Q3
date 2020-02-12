class TicTacToe {
    constructor() {
        this.currentPlayerSymbol = 'x';
        this.rowCount = 3;
        this.colCount = 3;

        this.turnsCountMax = this.rowCount * this.colCount;
        this.rows = [];
        for (let i = 0; i < this.rowCount; i++) {
            this.rows.push([]);
            for (let j = 0; j < this.colCount; j++)
                this.rows[i].push(null);
        }
        this.turnsCount = 0;
    }

    getCurrentPlayerSymbol() {
        return this.currentPlayerSymbol;
    }

    nextTurn(rowIndex, columnIndex) {
        if (this.rows[rowIndex][columnIndex] !== null)
            return;
        this.rows[rowIndex][columnIndex] = this.currentPlayerSymbol;
        this.currentPlayerSymbol = this.currentPlayerSymbol === 'x' ? 'o' : 'x';
        this.turnsCount++;
    }

    isFinished() {
        return this.noMoreTurns() || this.getWinner() !== null;
    }

    getWinnerByRow(i) {
        let first = this.rows[i][0];
        for (let j = 1; j < this.colCount; j++)
            if (first !== this.rows[i][j])
                return null;
        return first;
    }

    getWinnerByCol(j) {
        let first = this.rows[0][j];
        for (let i = 1; i < this.rowCount; i++)
            if (first !== this.rows[i][j])
                return null;
        return first;
    }

    getWinnerByDiagonal(startI, endI, stepI) {
        let first = this.rows[startI][0];
        for (let i = startI + stepI, j = 1; i !== endI && j < this.colCount; i += stepI, j++)
            if (first !== this.rows[i][j])
                return null;
        return first;
    }

    getWinner() {
        let winner = null;
        for (let i = 0; i < this.rowCount; i++) {
            winner = this.getWinnerByRow(i)
            if (winner)
                return winner;
        }
        for (let j = 0; j < this.colCount; j++) {
            winner = this.getWinnerByCol(j)
            if (winner)
                return winner;
        }
        winner = this.getWinnerByDiagonal(0, this.rowCount, 1);
        if (winner)
            return winner;
        return this.getWinnerByDiagonal(this.rowCount - 1, -1, -1);
    }

    noMoreTurns() {
        return this.turnsCount === this.turnsCountMax;
    }

    isDraw() {
        return this.noMoreTurns() && this.getWinner() === null;
    }

    getFieldValue(rowIndex, colIndex) {
        return this.rows[rowIndex][colIndex];
    }
}

module.exports = TicTacToe;
