'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        res.json({ error: "Required field(s) missing" });
        return;
      }

      const validationMessage = solver.validate(puzzle);
      if (validationMessage !== "Valid") {
        res.json({ error: validationMessage });
        return;
      }

      const row = coordinate.charAt(0).toUpperCase();
      const column = parseInt(coordinate.charAt(1), 10);

      if (!/[A-I]/.test(row) || isNaN(column) || column < 1 || column > 9) {
        res.json({ error: "Invalid coordinate" });
        return;
      }

      if (!/^[1-9]$/.test(value)) {
        res.json({ error: "Invalid value" });
        return;
      }

      const rowIndex = solver.letterToNumber(row) - 1;
      const columnIndex = column - 1;
      const index = rowIndex * 9 + columnIndex;

      if (puzzle[index] === value) {
        res.json({ valid: true });
        return;
      }

      const validRow = solver.checkRowPlacement(puzzle, rowIndex, columnIndex, value);
      const validCol = solver.checkColPlacement(puzzle, rowIndex, columnIndex, value);
      const validReg = solver.checkRegionPlacement(puzzle, rowIndex, columnIndex, value);
      let conflicts = [];

      if (validRow && validCol && validReg) {
        res.json({ valid: true });
      } else {
        if (!validRow) conflicts.push("row");
        if (!validCol) conflicts.push("column");
        if (!validReg) conflicts.push("region");
        res.json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        res.json({ error: "Required field missing" });
        return;
      }

      const validationMessage = solver.validate(puzzle);
      if (validationMessage !== "Valid") {
        res.json({ error: validationMessage });
        return;
      }

      try {
        const solution = solver.solve(puzzle);
        res.json({ solution });
      } catch (error) {
        res.json({ error: "Puzzle cannot be solved" });
      }
    });
};
