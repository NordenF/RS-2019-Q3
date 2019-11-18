// Line with Bresenham's algorithm.

function bresenham(x0, y0, x1, y1) {
  const deltax = Math.abs(x1 - x0);
  const deltay = Math.abs(y1 - y0);
  if (deltay > deltax) {
    // noinspection JSSuspiciousNameCombination
    const resultPixels = bresenham(y0, x0, y1, x1);
    for (let i = 0; i < resultPixels.length; i += 1) {
      const {x, y} = resultPixels[i];
      // noinspection JSSuspiciousNameCombination
      resultPixels[i].x = y;
      // noinspection JSSuspiciousNameCombination
      resultPixels[i].y = x;
    }
    return resultPixels;
  }
  let error = 0;
  const deltaerr = deltay;
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
    error += deltaerr;
    if (2 * error >= deltax) {
      y += diry;
      error -= deltax;
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

// Convert image to grayscale.

function toGrayscaleImage(image, resultHandler) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < imgPixels.height; y++) {
    for (let x = 0; x < imgPixels.width; x++) {
      const i = (y * 4) * imgPixels.width + x * 4;
      const avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
      imgPixels.data[i] = avg;
      imgPixels.data[i + 1] = avg;
      imgPixels.data[i + 2] = avg;
    }
  }
  ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  const imageGrayscale = new Image();
  imageGrayscale.src = canvas.toDataURL();
  imageGrayscale.onload = () => {
    resultHandler(imageGrayscale);
  };
}

function toGrayscaleColor(color) {
  // color, for example: '#af12bb'
  const r = Number.parseInt(color.substr(1, 2), 16);
  const g = Number.parseInt(color.substr(3, 2), 16);
  const b = Number.parseInt(color.substr(5, 2), 16);
  const avgStr = Math.floor((r + g + b) / 3).toString(16);
  return `#${avgStr}${avgStr}${avgStr}`;
}

module.exports = {
  linePixels,
  toGrayscaleImage,
  toGrayscaleColor,
};
