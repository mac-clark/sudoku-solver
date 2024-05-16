const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {

    suite('Puzzle String Validation', () => {
      test('Logic handles a valid puzzle string of 81 characters', () => {
        const validPuzzle = puzzlesAndSolutions[0][0];
        assert.equal(solver.validate(validPuzzle), "Valid");
      });
  
      test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const invalidCharsPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
        assert.equal(solver.validate(invalidCharsPuzzle), "Invalid characters in puzzle");
      });
  
      test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
        assert.equal(solver.validate(shortPuzzle), "Expected puzzle to be 81 characters long");
      });
    });
  
    suite('Row Placement Validation', () => {
      const puzzle = puzzlesAndSolutions[0][0];
  
      test('Logic handles a valid row placement', () => {
        assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3'));
      });
  
      test('Logic handles an invalid row placement', () => {
        assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'));
      });
    });
  
    suite('Column Placement Validation', () => {
      const puzzle = puzzlesAndSolutions[0][0];
  
      test('Logic handles a valid column placement', () => {
        assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3'));
      });
  
      test('Logic handles an invalid column placement', () => {
        assert.isFalse(solver.checkColPlacement(puzzle, 0, 1, '6'));
      });
    });
  
    suite('Region Placement Validation', () => {
      const puzzle = puzzlesAndSolutions[0][0];
  
      test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '3'));
      });
  
      test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '5'));
      });
    });
  
    suite('Solver Functionality', () => {
      puzzlesAndSolutions.forEach(([puzzle, solution], index) => {
        test(`Valid puzzle strings pass the solver - Test ${index + 1}`, () => {
          assert.equal(solver.solve(puzzle), solution);
        });
      });
  
      test('Invalid puzzle strings fail the solver', () => {
        const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
        assert.throws(() => solver.solve(invalidPuzzle), Error, "Invalid puzzle string");
      });
  
      puzzlesAndSolutions.forEach(([puzzle, solution], index) => {
        test(`Solver returns the expected solution for an incomplete puzzle - Test ${index + 1}`, () => {
          assert.equal(solver.solve(puzzle), solution);
        });
      });
    });
  });
