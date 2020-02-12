// Line with Bresenham's algorithm.

function bresenham(x0, y0, x1, y1) {
  const deltax = Math.abs(x1 - x0);
  const deltay = Math.abs(y1 - y0);
  if (deltay > deltax) {
    // noinspection JSSuspiciousNameCombination
    const resultPixels = bresenham(y0, x0, y1, x1);
    for (let i = 0; i < resultPixels.length; i += 1) {
      const { x, y } = resultPixels[i];
      // noinspection JSSuspiciousNameCombination
      resultPixels[i].x = y;
      // noinspection JSSuspiciousNameCombination
      resultPixels[i].y = x;
    }
    return resultPixels;
  }
  let inaccuracy = 0;
  let y = y0;
  let diry = y1 - y0;
  if (diry > 0) {
    diry = 1;
  }
  if (diry < 0) {
    diry = -1;
  }
  const step = x0 < x1 ? 1 : -1;
  const resultPixels = [];
  for (let x = x0; x !== x1 + step; x += step) {
    resultPixels.push({
      x, y,
    });
    inaccuracy += deltay;
    if (2 * inaccuracy >= deltax) {
      y += diry;
      inaccuracy -= deltax;
    }
  }
  return resultPixels;
}

function linePixels(position0, position1) {
  const x0 = position0.x;
  const y0 = position0.y;
  const x1 = position1.x;
  const y1 = position1.y;

  if (x0 === x1 && y0 === y1) {
    return [{
      x: x0,
      y: y0,
    }];
  }
  return bresenham(x0, y0, x1, y1);
}

module.exports = {
  linePixels,
};
