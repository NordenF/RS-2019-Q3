import '../sass/styles.scss';

import 'file-loader?name=[name].[ext]!../index.html';


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

  /*
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
   */

  function draw4x4() {
    clearCanvas();
    //drawMatrix(4, data4x4, parseColorFromHex);
  }

  function draw32x32() {
    clearCanvas();
    //drawMatrix(32, data32x32);
  }

  function draw64x64() {
    clearCanvas();
    //drawMatrix(32, data32x32);
  }

  const btn4x4 = document.getElementById('btn_4x4');
  const btn32x32 = document.getElementById('btn_32x32');
  const btn64x64 = document.getElementById('btn_64x64');

  btn4x4.addEventListener('click', draw4x4);
  btn32x32.addEventListener('click', draw32x32);
  btn64x64.addEventListener('click', draw64x64);
});
