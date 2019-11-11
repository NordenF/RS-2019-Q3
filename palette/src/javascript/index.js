import '../sass/styles.scss';

import 'file-loader?name=[name].[ext]!../index.html';


class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width, height, color) {
    const pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  draw(pixels) {
    for (let {x, y, color} of pixels) {
      this.pixels[x + y * this.width] = color;
    }
  }
}


class Canvas {
  constructor(canvasElement, state, onMouseDown) {
    const canvasSize = 512;
    this.canvas = canvasElement;
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.canvas.addEventListener('mousedown', (event) => {
      this.mouse(event, onMouseDown);
    });

    this.state = state;
    this.syncState();
    this.state.subscribe(() => {
      this.syncState();
    });
  }

  syncState() {
    this.scaleX = this.canvas.width / this.state.picture.width;
    this.scaleY = this.canvas.height / this.state.picture.height;
    for (let y = 0; y < this.state.picture.height; y += 1) {
      for (let x = 0; x < this.state.picture.width; x += 1) {
        this.ctx.fillStyle = this.state.picture.pixel(x, y);
        //console.log(this.ctx.fillStyle);
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

class State {
  constructor(tool, color, previousColor, picture) {
    this.tool = tool;
    this.color = color;
    this.previousColor = previousColor;
    this.picture = picture;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    for (let i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i]();
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const state = new State('draw', '#ff0000', '#ff0000', null);

  const reset = (size) => {
    state.picture = Picture.empty(size, size, '#ffffff');
    state.notifyListeners();
  };

  const resetButtons = [
    document.getElementById('btn_4x4'),
    document.getElementById('btn_32x32'),
    document.getElementById('btn_64x64'),
  ];
  resetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      reset(Number(btn.getAttribute("data-size")));
    });
  });
  reset(
    Number(resetButtons[0].getAttribute("data-size"))
  );


  const tools = {
    draw: (pos, state) => {
      function drawPixel(p, state) {
        const pixels = [{x: p.x, y: p.y, color: state.color}];
        state.picture.draw(pixels);
        state.notifyListeners();
      }

      drawPixel(pos, state);
      return drawPixel;
    },
  };

  const mouseDown = (pos) => {
    const tool = tools[state.tool];
    const onMove = tool(pos, state);
    if (onMove) {
      return (newPos) => onMove(newPos, state);
    }
    return null;
  };

  const canvas = new Canvas(
    document.getElementById('canvas'),
    state,
    mouseDown);

  const switchColor = document.getElementById('switch-color');
  switchColor.addEventListener('change', () => {
    state.previousColor = state.color;
    state.color = switchColor.value;
    state.notifyListeners();
  });
  state.subscribe(() => {
    switchColor.value = state.color;
  });

  const prevColor = document.getElementById('prev-color');
  const prevColorIcon = prevColor.getElementsByClassName(
    'prev-color-icon')[0];
  prevColor.addEventListener('click', () => {
    state.previousColor = state.color;
    state.color = prevColorIcon.backgroundColor;
    state.notifyListeners();
  });
  state.subscribe(() => {
    prevColorIcon.style.backgroundColor = state.previousColor;
  });

  state.notifyListeners();
});
