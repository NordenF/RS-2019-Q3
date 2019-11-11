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
    for (const {x, y, color} of pixels) {
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
        // console.log(this.ctx.fillStyle);
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
  constructor(tool, previousTool, color, previousColor, picture) {
    this.tool = tool;
    this.previousTool = previousTool;
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

  setNewTool(tool) {
    this.previousTool = this.tool;
    this.tool = tool;
  }

  setNewColor(color) {
    this.previousColor = this.color;
    this.color = color;
  }
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

  const resultPixels = [];

  if (x0 === x1) {
    const step = y0 < y1 ? 1 : -1;
    for (let y = y0; y !== y1 + step; y += step) {
      resultPixels.push({
        x: x0,
        y,
      });
    }
    return resultPixels;
  }

  if (y0 === y1) {
    const step = x0 < x1 ? 1 : -1;
    for (let x = x0; x !== x1 + step; x += step) {
      resultPixels.push({
        x,
        y: y0,
      });
    }
    return resultPixels;
  }

  // Line with Bresenham's algorithm.
  const deltax = Math.abs(x1 - x0);
  const deltay = Math.abs(y1 - y0);
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

function getDefaultState() {
  return new State(
    'pencil',
    'pencil',
    '#31d0cc',
    '#ffffff',
    Picture.empty(4, 4, '#ffffff'),
  );
}

function loadState() {
  let storaged = null; //localStorage.getItem("pallete-state");
  if (storaged) {
    return new State(
      storaged.tool,
      storaged.previousTool,
      storaged.color,
      storaged.previousColor,
      storaged.picture,
    );
  }
  return getDefaultState();
}

function saveState(state) {
  localStorage.setItem("pallete-state", {
    tool: state.tool,
    previousTool: state.previousTool,
    color: state.color,
    previousColor: state.previousColor,
    picture: state.picture,
  });
}

//var serialObj = JSON.stringify(obj); //сериализуем его

//localStorage.setItem("myKey", serialObj); //запишем его в хранилище по ключу "myKey"

//var returnObj = JSON.parse(localStorage.getItem("myKey")) //спарсим его обратно объект


document.addEventListener('DOMContentLoaded', () => {
  let state = loadState();
  window.addEventListener('beforeunload', () => {
    saveState(state);
  });

  document.getElementById('btn_full_reset').addEventListener('click', () => {
    state = getDefaultState();
  });

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
      reset(Number(btn.getAttribute('data-size')));
    });
  });

  const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1}];

  const tools = {
    'choose-color': (pos, state) => {
      state.setNewColor(state.picture.pixel(pos.x, pos.y));
      state.setNewTool(state.previousTool);
      state.notifyListeners();
      return null;
    },
    pencil: (pos, state) => {
      let prevPos = pos;

      function drawPixel(p, state) {
        const pixels = linePixels(prevPos, p);
        for (let i = 0; i < pixels.length; i += 1) {
          pixels[i].color = state.color;
        }
        state.picture.draw(pixels);
        state.notifyListeners();
        prevPos = p;
      }

      drawPixel(pos, state);
      return drawPixel;
    },
    'paint-bucket': (pos, state) => {
      const targetColor = state.picture.pixel(pos.x, pos.y);
      const pixelsToDraw = [{x: pos.x, y: pos.y, color: state.color}];
      for (let done = 0; done < pixelsToDraw.length; done += 1) {
        for (let i = 0; i < around.length; i += 1) {
          const dx = around[i].dx;
          const dy = around[i].dy;
          const x = pixelsToDraw[done].x + dx;
          const y = pixelsToDraw[done].y + dy;
          if (x >= 0 && x < state.picture.width && y >= 0 && y < state.picture.height
            && state.picture.pixel(x, y) === targetColor
            && !pixelsToDraw.some((p) => p.x === x && p.y === y)
          ) {
            pixelsToDraw.push({
              x, y, color: state.color,
            });
          }
        }
      }
      state.picture.draw(pixelsToDraw);
      state.notifyListeners();
      return null;
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
    mouseDown,
  );

  const toolsControls = document.querySelectorAll('.panel-tools .btn');
  for (let i = 0; i < toolsControls.length; i += 1) {
    const toolId = toolsControls[i].id;
    if (toolId) {
      toolsControls[i].addEventListener('click', () => {
        state.setNewTool(toolId);
        state.notifyListeners();
      });
      state.subscribe(() => {
        toolsControls[i].classList.toggle('active', state.tool === toolId);
      });
    }
  }

  const switchColor = document.getElementById('switch-color');
  switchColor.addEventListener('change', () => {
    state.setNewColor(switchColor.value);
    state.notifyListeners();
  });
  state.subscribe(() => {
    switchColor.value = state.color;
  });

  const prevColor = document.getElementById('prev-color');
  state.subscribe(() => {
    prevColor.value = state.previousColor;
  });

  const colors = document.querySelectorAll('.color-picker.clickable');
  for (let i = 0; i < colors.length; i += 1) {
    colors[i].addEventListener('click', () => {
      state.previousColor = state.color;
      state.color = colors[i].querySelector('.color-picker__control').value;
      state.notifyListeners();
    });
  }

  state.notifyListeners();
});
