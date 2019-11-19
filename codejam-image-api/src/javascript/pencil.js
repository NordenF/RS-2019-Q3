const bresenham = require('./bresenham');

function pencil(pos, color, drawer) {
  let prevPos = pos;

  function drawPixel(p) {
    const pixels = bresenham.linePixels(prevPos, p);

    for (let i = 0; i < pixels.length; i += 1) {
      pixels[i].color = color;
    }

    drawer(pixels);
    prevPos = p;
  }

  drawPixel(pos);
  return drawPixel;
}

module.exports = {
  pencil,
};
