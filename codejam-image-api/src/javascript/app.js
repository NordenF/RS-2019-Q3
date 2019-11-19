const { Picture } = require('./picture');
const { convertImage } = require('./grayscale');
const { loadImage, requestImageSrcFromUnsplash } = require('./utils');

class App {
  static getDefaultState() {
    return {
      tool: 'pencil',
      previousTool: 'pencil',
      color: '#006400', // Darkgreen.
      previousColor: '#ffffff',
      picture: Picture.empty(128, 128),
      image: null,
      imageGrayscale: null,
      city: '',
      isGrayscale: false,
    };
  }

  constructor(state) {
    Object.assign(this, this.constructor.getDefaultState(), state);
    this.listeners = [];
  }

  toJSON() {
    let imageData = null;
    if (this.image) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      tempCanvas.width = this.image.width;
      tempCanvas.height = this.image.height;

      tempCtx.drawImage(this.image, 0, 0, this.image.width, this.image.height);

      imageData = tempCanvas.toDataURL('image/png');
    }

    return JSON.stringify({
      tool: this.tool,
      previousTool: this.previousTool,
      color: this.color,
      previousColor: this.previousColor,
      picture: this.picture,
      imageData,
      city: this.city,
      isGrayscale: this.isGrayscale,
    });
  }

  static fromJSON(jsonStr) {
    let imageSrc = null;
    let state;
    try {
      state = JSON.parse(jsonStr, (key, valueStr) => {
        if (!key || !valueStr) {
          return valueStr;
        }
        switch (key) {
          case 'picture':
            return Picture.fromJSON(valueStr);
          case 'imageData':
            imageSrc = valueStr;
            return undefined;
          default:
            return valueStr;
        }
      });
    } catch (e) {
      state = null;
    }

    if (imageSrc) {
      return loadImage(imageSrc)
        .then((image) => {
          state.image = image;
          return convertImage(image);
        })
        .then((imageGrayscale) => {
          state.imageGrayscale = imageGrayscale;
          return new App(state);
        });
    }
    return Promise.resolve(new App(state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners(eventSourceElement) {
    for (let i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i](eventSourceElement);
    }
  }

  setImage(image) {
    this.image = image;
    return (image ? convertImage(image) : Promise.resolve(null))
      .then((imageGrayscale) => {
        this.imageGrayscale = imageGrayscale;
        this.notifyListeners();
      });
  }

  clearPicture() {
    this.picture.clear();
    this.notifyListeners();
  }

  setTool(tool) {
    this.previousTool = this.tool;
    this.tool = tool;
    this.notifyListeners();
  }

  setColor(color, sourceElement) {
    this.previousColor = this.color;
    this.color = color;
    this.notifyListeners(sourceElement);
  }

  reset() {
    Object.assign(this, this.constructor.getDefaultState());
    this.notifyListeners();
  }

  rescale(scale) {
    this.picture.rescale(scale);
    this.notifyListeners();
  }

  setCity(city, sourceElement) {
    this.city = city;
    this.notifyListeners(sourceElement);
  }

  switchGrayscale() {
    this.isGrayscale = !this.isGrayscale;
    this.notifyListeners();
  }

  loadImageFromUnsplash() {
    return requestImageSrcFromUnsplash(this.city)
      .then((url) => loadImage(url))
      .then((image) => this.setImage(image));
  }

  draw(pixelsToDraw) {
    this.picture.draw(pixelsToDraw);
    this.notifyListeners();
  }
}

module.exports = {
  App,
};
