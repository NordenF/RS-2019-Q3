require('../sass/styles.scss');
// eslint-disable-next-line import/no-webpack-loader-syntax,import/no-unresolved
require('file-loader?name=[name].[ext]!../index.html');
const {Canvas} = require('./canvas');
const {Picture} = require('./picture');
const utils = require('./utils');

class State {
  constructor(config) {
    const defaults = this.constructor.getDefauls();
    Object.assign(this, defaults);
    if (config) {
      Object.keys(config).forEach((key) => {
        let picture = null;
        let image = null;
        switch (key) {
          case 'picture':
            picture = config[key];
            if (picture) {
              this.picture = picture.constructor.name === 'Picture'
                ? picture
                : new Picture(config.picture.width, config.picture.height, config.picture.pixels);
            }
            break;
          case 'image':
            if (config[key]) {
              image = new Image();
              image.onload = () => {
                this.setImage(image);
              };
              image.src = config[key];
            }
            break;
          default:
            this[key] = config[key];
        }
      });
    }
    this.listeners = [];
  }

  static getDefauls() {
    return {
      tool: 'pencil',
      previousTool: 'pencil',
      color: '#006400', // Darkgreen.
      previousColor: '#ffffff',
      picture: Picture.empty(4, 4, null),
      city: '',
      image: null,
      isGrayscale: false,
    };
  }

  getConfig() {
    let image = null;
    if (this.image) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = this.image.width;
      tempCanvas.height = this.image.height;

      tempCtx.drawImage(this.image, 0, 0, this.image.width, this.image.height);

      image = tempCanvas.toDataURL("image/png");
    }

    return {
      tool: this.tool,
      previousTool: this.previousTool,
      color: this.color,
      previousColor: this.previousColor,
      picture: this.picture,
      city: this.city,
      image,
      isGrayscale: this.isGrayscale,
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

  setImage(image) {
    this.image = image;
    if (image) {
      utils.toGrayscaleImage(image, (imageGrayscale) => {
        this.imageGrayscale = imageGrayscale;
        this.notifyListeners();
      });
    } else {
      this.imageGrayscale = null;
      this.notifyListeners();
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
    const {image} = this;
    Object.assign(this, this.constructor.getDefauls());
    this.picture = Picture.empty(size, size, null);
    this.setImage(image);
    this.notifyListeners();
  }

  removeImage() {
    this.image = null;
    this.imageGrayscale = null;
    this.notifyListeners();
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  switchGrayscale() {
    this.isGrayscale = !this.isGrayscale;
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
    state.setNewColor(state.canvas.getPyxel(pos.pixelX, pos.pixelY));
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

function loadAndSetImage(city, state) {
  const unsplashAccessKey = '6afe374906d700472e3a0fc5c79c6671edef4e13328d31796b751bb9e77edb0c';
  const unsplashUrl = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=${unsplashAccessKey}`;
  fetch(unsplashUrl)
    .then((response) => {
      if (!response.ok) {
        window.console.log('Error request image. Status:', response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data) {
        return;
      }

      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        state.setImage(image);
      };
      image.src = data.urls.small;
    });
}

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

  document.getElementById('remove_image').addEventListener(
    'click', () => {
      state.removeImage();
    },
  );

  const loadBtn = document.getElementById('load_btn');
  loadBtn.addEventListener('click', () => {
    loadAndSetImage(state.city, state);
  });
  const cityInput = document.getElementById('city_input');
  cityInput.addEventListener('change', () => {
    state.city = cityInput.value;
  });
  state.subscribe(() => {
    cityInput.value = state.city;
  });

  document.getElementById('bw_btn').addEventListener('click', () => {
    state.switchGrayscale();
  });

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
          if (ev.code === hotKey && ev.target !== cityInput) {
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

  const panelColors = document.querySelector('.panel-colors');
  state.subscribe(() => {
    panelColors.classList.toggle('grayscale', state.isGrayscale);
  });

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
  state.setCanvas(canvas);

  state.notifyListeners();
});
