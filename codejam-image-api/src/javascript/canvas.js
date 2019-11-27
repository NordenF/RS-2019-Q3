const grayscale = require('./grayscale');

class Canvas {
  constructor(canvasElement, canvasSize) {
    this.canvas = canvasElement;
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.recalculateRect();
    this.canvas.addEventListener('mousemove', (ev) => {
      this.mouseMove(ev);
    });
  }

  recalculateRect() {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  addMouseDownListener(onMouseDown) {
    this.canvas.addEventListener('mousedown', (event) => {
      this.mouse(event, onMouseDown);
    });
  }

  drawImage(image) {
    if (!image) {
      return;
    }

    const canvasRatio = this.canvas.height / this.canvas.width;
    const imageRatio = image.height / image.width;
    const multiplier = imageRatio > canvasRatio
      ? this.canvas.height / image.height
      : this.canvas.width / image.width;
    const resultWidth = image.width * multiplier;
    const resultHeight = image.height * multiplier;
    let dx = 0;
    let dy = 0;
    if (imageRatio > canvasRatio) {
      dx = (this.canvas.width - resultWidth) / 2;
    } else {
      dy = (this.canvas.height - resultHeight) / 2;
    }
    this.ctx.drawImage(image, 0, 0, image.width, image.height,
      dx, dy, resultWidth, resultHeight);
  }

  drawPicture(picture, isGrayscale) {
    this.scaleX = this.canvas.width / picture.width;
    this.scaleY = this.canvas.height / picture.height;
    for (let y = 0; y < picture.height; y += 1) {
      for (let x = 0; x < picture.width; x += 1) {
        let color = picture.pixel(x, y);
        if (color) {
          if (isGrayscale) {
            color = grayscale.convertPixel(color);
          }

          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            x * this.scaleX,
            y * this.scaleY,
            this.scaleX,
            this.scaleY,
          );
        }
      }
    }
  }

  draw(image, imageGrayscale, picture, isGrayscale) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImage(isGrayscale ? imageGrayscale : image);
    this.drawPicture(picture, isGrayscale);
  }

  getPyxel(pixelX, pixelY) {
    if (pixelX < 0 || pixelY < 0
      || pixelX >= this.canvas.width || pixelY >= this.canvas.height) {
      throw new Error('Coordinates are out of bounds.');
    }
    const pyxel = this.ctx.getImageData(pixelX, pixelY, 1, 1).data;
    return `#${pyxel[0].toString(16)}${pyxel[1].toString(16)}${pyxel[2].toString(16)}`;
  }

  pointerPosition(downEvent) {
    const rect = this.canvasRect;
    const pixelX = downEvent.clientX - rect.left;
    const pixelY = downEvent.clientY - rect.top;

    return {
      pixelX,
      pixelY,
      x: Math.floor(pixelX / this.scaleX),
      y: Math.floor(pixelY / this.scaleY),
    };
  }

  mouse(downEvent, onDown) {
    if (downEvent.button !== 0) {
      return;
    }

    this.mousePos = this.pointerPosition(downEvent);
    this.onMove = onDown(this.mousePos);
    if (!this.onMove) {
      return;
    }
    this.listenMoving = true;
  }

  mouseMove(moveEvent) {
    if (!this.listenMoving) {
      return;
    }

    if (moveEvent.buttons === 0) {
      this.listenMoving = false;
    } else {
      const newPos = this.pointerPosition(moveEvent);
      if (newPos.x === this.mousePos.x && newPos.y === this.mousePos.y) {
        return;
      }
      this.mousePos = newPos;
      this.onMove(newPos);
    }
  }
}

module.exports = {
  Canvas,
};
