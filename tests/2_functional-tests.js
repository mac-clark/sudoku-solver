const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
      test('Solve a puzzle with valid puzzle string', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: puzzlesAndSolutions[0][0] })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'solution');
            assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
            done();
          });
      });
  
      test('Solve a puzzle with missing puzzle string', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field missing');
            done();
          });
      });
  
      test('Solve a puzzle with invalid characters', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });
  
      test('Solve a puzzle with incorrect length', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });
  
      test('Solve a puzzle that cannot be solved', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: '9'.repeat(81) })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, undefined);
            done();
          });
      });
    });
  
    suite('POST /api/check', () => {
      test('Check a puzzle placement with all fields', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'A2',
            value: '3'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.isTrue(res.body.valid);
            done();
          });
      });
  
      test('Check a puzzle placement with single placement conflict', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'A2',
            value: '5'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.isFalse(res.body.valid);
            assert.property(res.body, 'conflict');
            assert.include(res.body.conflict, 'row');
            done();
          });
      });
  
      test('Check a puzzle placement with multiple placement conflicts', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'A2',
            value: '6'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.isFalse(res.body.valid);
            assert.property(res.body, 'conflict');
            assert.include(res.body.conflict, 'column');
            done();
          });
      });
  
      test('Check a puzzle placement with all placement conflicts', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'A2',
            value: '2'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.isFalse(res.body.valid);
            assert.property(res.body, 'conflict');
            assert.include(res.body.conflict, 'row');
            assert.include(res.body.conflict, 'column');
            assert.include(res.body.conflict, 'region');
            done();
          });
      });
  
      test('Check a puzzle placement with missing required fields', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0]
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
          });
      });
  
      test('Check a puzzle placement with invalid characters', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X',
            coordinate: 'A2',
            value: '3'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });
  
      test('Check a puzzle placement with incorrect length', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3',
            coordinate: 'A2',
            value: '3'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });
  
      test('Check a puzzle placement with invalid placement coordinate', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'Z9',
            value: '3'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid coordinate');
            done();
          });
      });
  
      test('Check a puzzle placement with invalid placement value', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: puzzlesAndSolutions[0][0],
            coordinate: 'A2',
            value: '0'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid value');
            done();
          });
      });
    });
  });

