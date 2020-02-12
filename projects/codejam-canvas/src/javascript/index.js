import '../sass/styles.scss';

require('file-loader?name=[name].[ext]!../index.html');

const data4x4 = require('../data/4x4.json');
const data32x32 = require('../data/32x32.json');


function parseColorFromHex(str) {
  if (str.length < 6) {
    throw new Error('Invalid color literal.');
  }

  const result = [];
  let colorPartIndex = 0;
  for (; colorPartIndex < 3; colorPartIndex += 1) {
    result.push(parseInt(str.substr(colorPartIndex * 2, 2), 16));
  }

  if (str.length === 6) {
    result.push(255); // Default alfa-part.
  } else if (str.length === 8) {
    result.push(parseInt(str.substr(colorPartIndex * 2, 2), 16));
  } else {
    throw new Error('Invalid color literal.');
  }

  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  const canvasSize = 512;
  const canvas = document.getElementById('canvas');

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext('2d');

  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  function drawMatrix(size, jsonData, colorParser = null) {
    if (!colorParser) {
      colorParser = (color) => color;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;

    const tempCtx = tempCanvas.getContext('2d');

    const imgData = tempCtx.createImageData(size, size);
    let pixelIndex = 0;

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const color = colorParser(jsonData[i][j]);
        for (let colorPartIndex = 0; colorPartIndex < 4; colorPartIndex += 1) {
          imgData.data[pixelIndex + colorPartIndex] = color[colorPartIndex];
        }
        pixelIndex += 4;
      }
    }

    tempCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, canvasSize, canvasSize);
  }

  function draw32x32() {
    clearCanvas();
    drawMatrix(32, data32x32);
  }

  function draw4x4() {
    clearCanvas();
    drawMatrix(4, data4x4, parseColorFromHex);
  }

  function drawImage() {
    clearCanvas();
    const image = new Image(canvas.width, canvas.height);
    image.onload = function() {
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    };

    image.src = 'data/image.png';
  }

  const btn32x32 = document.getElementById('btn_32x32');
  const btn4x4 = document.getElementById('btn_4x4');
  const btnImage = document.getElementById('btn_image');

  btn32x32.addEventListener('click', draw32x32);
  btn4x4.addEventListener('click', draw4x4);
  btnImage.addEventListener('click', drawImage);
});
