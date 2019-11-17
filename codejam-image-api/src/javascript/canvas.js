class Canvas {
  constructor(canvasElement, state) {
    const canvasSize = 512;
    this.canvas = canvasElement;
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.state = state;
    this.syncState();
    this.state.subscribe(() => {
      this.syncState();
    });
  }

  getPyxel(pixelX, pixelY) {
    if (pixelX < 0 || pixelY < 0
      || pixelX >= this.canvas.width || pixelY >= this.canvas.height) {
      throw new Error('Coordinates out of bounds');
    }
    const pyxel = this.ctx.getImageData(pixelX, pixelY, 1, 1).data;
    return `#${pyxel[0].toString(16)}${pyxel[1].toString(16)}${pyxel[2].toString(16)}`;
  }

  addMouseDownListener(onMouseDown) {
    this.canvas.addEventListener('mousedown', (event) => {
      this.mouse(event, onMouseDown);
    });
  }

  drawImage() {
    if (!this.state.image) {
      return;
    }
    const {image} = this.state;

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

  syncState() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImage();
    this.scaleX = this.canvas.width / this.state.picture.width;
    this.scaleY = this.canvas.height / this.state.picture.height;
    for (let y = 0; y < this.state.picture.height; y += 1) {
      for (let x = 0; x < this.state.picture.width; x += 1) {
        const color = this.state.picture.pixel(x, y);
        if (color) {
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

  pointerPosition(downEvent) {
    const rect = this.canvas.getBoundingClientRect();
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

    let pos = this.pointerPosition(downEvent);
    const onMove = onDown(pos);
    if (!onMove) {
      return;
    }

    const move = (moveEvent) => {
      if (moveEvent.buttons === 0) {
        this.canvas.removeEventListener('mousemove', move);
      } else {
        const newPos = this.pointerPosition(moveEvent);
        if (newPos.x === pos.x && newPos.y === pos.y) {
          return;
        }
        pos = newPos;
        onMove(newPos);
      }
    };
    this.canvas.addEventListener('mousemove', move);
  }
}

module.exports = {
  Canvas,
};
