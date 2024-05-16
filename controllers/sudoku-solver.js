class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";
    if (puzzleString.length !== 81) return "Expected puzzle to be 81 characters long";
    if (/[^1-9.]/.test(puzzleString)) return "Invalid characters in puzzle";
    return "Valid";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[rowStart + i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] == value) {
        return false;
      }
    }
    return true;
  }
  

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(regionRow + i) * 9 + regionCol + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  letterToNumber(letter) {
    return letter.toUpperCase().charCodeAt(0) - 64;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== "Valid") {
      throw new Error("Invalid puzzle string");
    }

    const board = puzzleString.split("");
    if (this.solveSudoku(board)) {
      return board.join("");
    } else {
      throw new Error("Puzzle cannot be solved");
    }
  }

  solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row * 9 + col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const charNum = String(num);
            if (
              this.checkRowPlacement(board, row, col, charNum) &&
              this.checkColPlacement(board, row, col, charNum) &&
              this.checkRegionPlacement(board, row, col, charNum)
            ) {
              board[row * 9 + col] = charNum;
              if (this.solveSudoku(board)) {
                return true;
              } else {
                board[row * 9 + col] = '.';
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;
