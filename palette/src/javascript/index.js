require('../sass/styles.scss');
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
require('file-loader?name=[name].[ext]!../index.html');
const { Canvas } = require('./canvas');
const { Picture } = require('./picture');
const utils = require('./utils');

class State {
  constructor(config) {
    const defaults = this.constructor.getDefauls();
    Object.assign(this, defaults, config);
    if (this.picture.constructor.name !== 'Picture') {
      this.picture = new Picture(
        config.picture.width, config.picture.height, config.picture.pixels,
      );
    }
    this.listeners = [];
  }

  static getDefauls() {
    return {
      tool: 'pencil',
      previousTool: 'pencil',
      color: '#006400', // Darkgreen.
      previousColor: '#ffffff',
      picture: Picture.empty(4, 4, '#ffffff'),
    };
  }

  getConfig() {
    return {
      tool: this.tool,
      previousTool: this.previousTool,
      color: this.color,
      previousColor: this.previousColor,
      picture: this.picture,
    };
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
    this.notifyListeners();
  }

  setNewColor(color) {
    this.previousColor = this.color;
    this.color = color;
    this.notifyListeners();
  }

  draw(pixelsToDraw) {
    this.picture.draw(pixelsToDraw);
    this.notifyListeners();
  }

  reset(size) {
    Object.assign(this, this.constructor.getDefauls());
    this.picture = Picture.empty(size, size, '#ffffff');
    this.notifyListeners();
  }
}

const around = [
  {
    dx: -1,
    dy: 0,
  },
  {
    dx: 1,
    dy: 0,
  },
  {
    dx: 0,
    dy: -1,
  },
  {
    dx: 0,
    dy: 1,
  },
];

const tools = {
  'choose-color': (pos, state) => {
    state.setNewColor(state.picture.pixel(pos.x, pos.y));
    state.setNewTool(state.previousTool);
    return null;
  },
  pencil: (pos, state) => {
    let prevPos = pos;
    function drawPixel(p, st) {
      const pixels = utils.linePixels(prevPos, p);

      for (let i = 0; i < pixels.length; i += 1) {
        pixels[i].color = state.color;
      }

      st.draw(pixels);
      prevPos = p;
    }

    drawPixel(pos, state);
    return drawPixel;
  },
  'paint-bucket': (pos, state) => {
    const targetColor = state.picture.pixel(pos.x, pos.y);
    const pixelsToDraw = [
      {
        x: pos.x,
        y: pos.y,
        color: state.color,
      },
    ];
    for (let done = 0; done < pixelsToDraw.length; done += 1) {
      for (let i = 0; i < around.length; i += 1) {
        const {
          dx,
          dy,
        } = around[i];
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
    state.draw(pixelsToDraw);
    return null;
  },
};


document.addEventListener('DOMContentLoaded', () => {
  const stateConfig = JSON.parse(localStorage.getItem('pallete-state'));
  const state = new State(stateConfig);
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('pallete-state', JSON.stringify(state.getConfig()));
  });

  const reset = (size) => {
    state.reset(size);
  };

  const resetButtons = document.querySelectorAll('.panel-switch .btn');
  for (let i = 0; i < resetButtons.length; i += 1) {
    const btn = resetButtons[i];
    btn.addEventListener('click', () => {
      reset(Number(btn.getAttribute('data-size')));
    });
  }

  const toolsControls = document.querySelectorAll('.panel-tools .btn');
  for (let i = 0; i < toolsControls.length; i += 1) {
    const toolId = toolsControls[i].id;
    if (toolId) {
      toolsControls[i].addEventListener('click', () => {
        state.setNewTool(toolId);
      });

      const hotKey = toolsControls[i].getAttribute('data-hotkey-code');
      if (hotKey) {
        document.addEventListener('keydown', (ev) => {
          if (ev.code === hotKey) {
            state.setNewTool(toolId);
          }
        });
      }

      state.subscribe(() => {
        toolsControls[i].classList.toggle('active', state.tool === toolId);
      });
    }
  }

  const switchColor = document.getElementById('switch-color');
  switchColor.addEventListener('change', () => {
    state.setNewColor(switchColor.value);
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
      state.setNewColor(colors[i].querySelector('.color-picker__control').value);
    });
  }

  const mouseDown = (pos) => {
    const tool = tools[state.tool];
    const onMove = tool(pos, state);
    if (onMove) {
      return (newPos) => onMove(newPos, state);
    }
    return null;
  };

  const canvas = new Canvas(document.getElementById('canvas'), state);
  canvas.addMouseDownListener(mouseDown);

  state.notifyListeners();
});
