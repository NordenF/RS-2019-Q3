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

  addMouseDownListener(onMouseDown) {
    this.canvas.addEventListener('mousedown', (event) => {
      this.mouse(event, onMouseDown);
    });
  }

  syncState() {
    this.scaleX = this.canvas.width / this.state.picture.width;
    this.scaleY = this.canvas.height / this.state.picture.height;
    for (let y = 0; y < this.state.picture.height; y += 1) {
      for (let x = 0; x < this.state.picture.width; x += 1) {
        this.ctx.fillStyle = this.state.picture.pixel(x, y);
        this.ctx.fillRect(
          x * this.scaleX,
          y * this.scaleY,
          this.scaleX,
          this.scaleY,
        );
      }
    }
  }

  pointerPosition(downEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.floor((downEvent.clientX - rect.left) / this.scaleX),
      y: Math.floor((downEvent.clientY - rect.top) / this.scaleY),
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
