const chai = require('chai');
const mocha = require('mocha');
const itParam = require('mocha-param');
const { linePixels } = require('./src/javascript/utils.js');

mocha.describe('Codjam pallete tests', () => {
  itParam(
    'linePixels should correctly construct line with Bresenham-algorithm',
    [
      {
        pos0: { x: 1, y: 1 },
        pos1: { x: 11, y: 5 },
        expectedPixels: [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 3 },
          { x: 6, y: 3 },
          { x: 7, y: 3 },
          { x: 8, y: 4 },
          { x: 9, y: 4 },
          { x: 10, y: 5 },
          { x: 11, y: 5 },
        ],
      },
      {
        pos0: { x: 19, y: 7 },
        pos1: { x: 21, y: 14 },
        expectedPixels: [
          { x: 19, y: 7 },
          { x: 19, y: 8 },
          { x: 20, y: 9 },
          { x: 20, y: 10 },
          { x: 20, y: 11 },
          { x: 20, y: 12 },
          { x: 21, y: 13 },
          { x: 21, y: 14 },
        ],
      },
    ],
    (testCase) => {
      // Given:
      const { pos0, pos1, expectedPixels } = testCase;

      // When:
      const resultPixels = linePixels(pos0, pos1);

      // Then:
      chai.expect(expectedPixels).to.eql(resultPixels);
    },
  );
});
