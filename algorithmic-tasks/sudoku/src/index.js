class Var {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.allowedValuesSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.allowedValues = null;
        this.valueIndex = null;
        this.value = null;
        this.groups = [];  // row, column and square, which contain this Var-cell.
    }

    adjustAllowedValuesAndSetOwnerGroup(otherSet, group) {
        this.allowedValuesSet = new Set(
            [...this.allowedValuesSet].filter(x => otherSet.has(x))
        );
        this.groups.push(group);
    }

    init() {
        this.allowedValues = Array.from(this.allowedValuesSet);
        if (!this.allowedValues.length)
            throw new Error("Allowes values list is empty!");
    }

    reset() {
        this.valueIndex = null;
        this.value = null;
    }

    check() {
        if (this.value === null)
            throw new Error("Value is in resetted state.");

        for (let i = 0; i < this.groups.length; i++)
            if (!this.groups[i].check())
                return false;

        return true;
    }

    next() {
        this.valueIndex = this.valueIndex === null ? 0 : this.valueIndex + 1;
        if (this.valueIndex >= this.allowedValues.length) {
            this.reset();
            return false;
        }

        this.value = this.allowedValues[this.valueIndex];
        while (!this.check()) {
            this.valueIndex++;
            if (this.valueIndex >= this.allowedValues.length) {
                this.reset();
                return false;
            }
            this.value = this.allowedValues[this.valueIndex];
        }
        return true;
    }
}

class Const {
    constructor(i, j, value) {
        this.i = i;
        this.j = j;
        this.value = value;
    }

    adjustAllowedValuesAndSetOwnerGroup(otherSet) {
        // Nothing to do. It is const, not variable.
    }
}

class Group {
    constructor() {
        this.cells = [];
        this.vars = [];
    }

    add(cell) {
        this.cells.push(cell);
    }

    init() {
        // This method should be called on init stage,
        // when variables have null-values, and constants have not-null.
        // This method:
        //   1) calculates allowed values for the group;
        //   2) notifies child cell-variables about these allowed values.
        let allowedValuesSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].value) {
                // It is const.
                allowedValuesSet.delete(this.cells[i].value);
            } else {
                // It is variable in resetted state (with value == null).
                this.vars.push(this.cells[i]);  // We save it for later...
            }
        }
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].adjustAllowedValuesAndSetOwnerGroup(
                allowedValuesSet, this);
        }
    }

    check() {
        // All cells should have different values.
        let set = new Set();
        for (let i = 0; i < this.vars.length; i++) {
            if (this.vars[i].value) {
                if (set.has(this.vars[i].value)) {
                    return false;
                }
                set.add(this.vars[i].value);
            }
        }
        return true;
    }
}

class Sudoku {
    _makeGroups(count) {
        let groups = [];
        for (let i = 0; i < count; i++)
            groups.push(new Group());
        return groups;
    }

    constructor(matrix) {
        this.rows = this._makeGroups(9);
        this.columns = this._makeGroups(9);
        this.squares = this._makeGroups(9);
        this.vars = [];

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let row = this.rows[i];
                let column = this.columns[j];
                let squareIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                let square = this.squares[squareIndex];

                let newCell = null;
                if (matrix[i][j]) {
                    newCell = new Const(i, j, matrix[i][j]);
                } else {
                    newCell = new Var(i, j);
                    this.vars.push(newCell);
                }

                row.add(newCell);
                column.add(newCell);
                square.add(newCell);
            }
        }

        this.initAllGroups();
        this.initVariables();
    }

    initGroups(cellsGroups) {
        for (let i = 0; i < cellsGroups.length; i++) {
            cellsGroups[i].init();
        }
    }

    initAllGroups() {
        this.initGroups(this.rows);
        this.initGroups(this.columns);
        this.initGroups(this.squares);
    }

    initVariables() {
        for (let i = 0; i < this.vars.length; i++)
            this.vars[i].init();
    }

    print() {
        let output = "";
        console.log("Matrix:");
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++)
                output += " " + (this.rows[i].cells[j].value ? this.rows[i].cells[j].value : "?");
            output += "\n";
        }
        console.log(output);
        if (!this.vars.length)
            console.log(`Variables missing.`);

        console.log(`There are ${this.vars.length} variables:`);
        output = "";
        for (let i = 0; i < this.vars.length; i++) {
            if (i > 0)
                output += ", ";
            output += `[${this.vars[i].i}; ${this.vars[i].j} // ${this.vars[i].allowedValues}]==${this.vars[i].value ? this.vars[i].value : "NULL"}`;
        }
        console.log(output);
    }

    solve() {
        let i = 0;
        do {
            while (i < this.vars.length && this.vars[i].next()) {
                i++;
            }
            if (i === this.vars.length) {
                break;
            }
            i--;
        } while (i >= 0);
        return i === this.vars.length;
    }

    getMatrix() {
        let resultRows = [];
        for (let i = 0; i < 9; i++) {
            let rowCells = [];
            for (let j = 0; j < 9; j++)
                rowCells.push(this.rows[i].cells[j].value);
            resultRows.push(rowCells);
        }
        return resultRows;
    }
}

module.exports = function solveSudoku(matrix) {
    let sudoku = new Sudoku(matrix);
    let isSolved = sudoku.solve();
    if (!isSolved) {
        sudoku.print();
        throw new Error("Not solved!");
    }
    return sudoku.getMatrix();
};
