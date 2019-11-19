const { Canvas } = require('./canvas');
const { App } = require('./app');
const { fill } = require('./fill');
const { pencil } = require('./pencil');

document.addEventListener('DOMContentLoaded', () => {
  App.fromJSON(localStorage.getItem('pixel-editor'))
    .then((app) => {
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('pixel-editor', app.toJSON());
      });

      document.getElementById('save').addEventListener(
        'click', () => {
          localStorage.setItem('pixel-editor', app.toJSON());
        },
      );

      const rescaleButtons = document.querySelectorAll('.panel-switch .btn.scale');
      for (let i = 0; i < rescaleButtons.length; i += 1) {
        const btn = rescaleButtons[i];
        btn.addEventListener('click', () => {
          app.rescale(Number(btn.getAttribute('data-scale')));
        });
      }

      document.getElementById('remove_image').addEventListener(
        'click', () => {
          app.setImage(null);
        },
      );

      document.getElementById('remove_picture').addEventListener(
        'click', () => {
          app.clearPicture();
        },
      );

      document.getElementById('reset').addEventListener(
        'click', () => {
          app.reset();
        },
      );

      const cityInput = document.getElementById('city_input');
      cityInput.addEventListener('change', () => {
        app.setCity(cityInput.value, cityInput);
      });
      app.subscribe((sourceElement) => {
        if (sourceElement !== cityInput) {
          cityInput.value = app.city;
        }
      });

      document.getElementById('load_btn').addEventListener('click', () => {
        app.loadImageFromUnsplash();
      });

      document.getElementById('bw_btn').addEventListener('click', () => {
        app.switchGrayscale();
      });

      const panelColors = document.querySelector('.panel-colors');
      app.subscribe(() => {
        panelColors.classList.toggle('grayscale', app.isGrayscale);
      });

      const switchColor = document.getElementById('switch-color');
      switchColor.addEventListener('change', () => {
        app.setColor(switchColor.value, switchColor);
      });
      app.subscribe((sourceElement) => {
        if (sourceElement !== switchColor) {
          switchColor.value = app.color;
        }
      });

      const prevColor = document.getElementById('prev-color');
      app.subscribe(() => {
        prevColor.value = app.previousColor;
      });

      const colors = document.querySelectorAll('.color-picker.clickable');
      for (let i = 0; i < colors.length; i += 1) {
        colors[i].addEventListener('click', () => {
          app.setColor(colors[i].querySelector('.color-picker__control').value);
        });
      }

      const toolsControls = document.querySelectorAll('.panel-tools .btn');
      for (let i = 0; i < toolsControls.length; i += 1) {
        const toolId = toolsControls[i].id;
        if (toolId) {
          toolsControls[i].addEventListener('click', () => {
            app.setTool(toolId);
          });

          const hotKey = toolsControls[i].getAttribute('data-hotkey-code');
          if (hotKey) {
            document.addEventListener('keydown', (ev) => {
              if (ev.code === hotKey && ev.target !== cityInput) {
                app.setTool(toolId);
              }
            });
          }

          app.subscribe(() => {
            toolsControls[i].classList.toggle('active', app.tool === toolId);
          });
        }
      }

      const canvas = new Canvas(document.getElementById('canvas'));
      canvas.addMouseDownListener((pos) => {
        if (app.tool === 'choose-color') {
          app.setColor(canvas.getPyxel(pos.pixelX, pos.pixelY));
          app.setTool(app.previousTool);
          return null;
        }
        if (app.tool === 'paint-bucket') {
          app.draw(fill(app.picture, pos, app.color));
          return null;
        }
        if (app.tool === 'pencil') {
          const onMove = pencil(pos, app.color, (pixelsToDraw) => {
            app.draw(pixelsToDraw);
          });
          return (newPos) => onMove(newPos);
        }
        return null;
      });
      app.subscribe(() => {
        canvas.draw(app.image, app.imageGrayscale, app.picture, app.isGrayscale);
      });

      app.notifyListeners();
    });
});
