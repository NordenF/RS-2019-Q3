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
    for (let i = 0; i < pixels.length; i += 1) {
      const { x, y, color } = pixels[i];
      this.pixels[x + y * this.width] = color;
    }
  }
}

module.exports = {
  Picture,
};
