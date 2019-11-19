const { loadImage } = require('./utils');

// Convert image to grayscale.

async function convertImage(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < imgPixels.height; y += 1) {
    for (let x = 0; x < imgPixels.width; x += 1) {
      const i = (y * 4) * imgPixels.width + x * 4;
      const avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
      imgPixels.data[i] = avg;
      imgPixels.data[i + 1] = avg;
      imgPixels.data[i + 2] = avg;
    }
  }

  ctx.putImageData(imgPixels, 0, 0, 0, 0,
    imgPixels.width, imgPixels.height);

  return loadImage(canvas.toDataURL());
}

function convertPixel(color) {
  // color, for example: '#af12bb'
  const r = Number.parseInt(color.substr(1, 2), 16);
  const g = Number.parseInt(color.substr(3, 2), 16);
  const b = Number.parseInt(color.substr(5, 2), 16);
  const avgStr = Math.floor((r + g + b) / 3).toString(16);
  return `#${avgStr}${avgStr}${avgStr}`;
}

module.exports = {
  convertImage,
  convertPixel,
};
