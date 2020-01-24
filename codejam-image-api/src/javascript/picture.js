class Picture {
  constructor(fullWidth, fullHeight, fullPixels, viewPort = null) {
    this.fullWidth = fullWidth;
    this.fullHeight = fullHeight;
    this.fullPixels = fullPixels;
    this.viewPort = viewPort || {
      x: 0,
      y: 0,
      width: fullWidth,
      height: fullHeight,
    };
  }

  static empty(fullWidth, fullHeight, viewPort = null) {
    const fullPixels = new Array(fullWidth * fullHeight).fill(null);
    return new Picture(fullWidth, fullHeight, fullPixels, viewPort);
  }

  clear() {
    this.fullPixels.fill(null);
  }

  static fromJSON(jsonStr) {
    const obj = typeof (jsonStr) === 'object' ? jsonStr : JSON.parse(jsonStr);
    return new Picture(obj.fullWidth, obj.fullHeight, obj.fullPixels, obj.viewPort);
  }

  get width() {
    return this.viewPort.width;
  }

  get height() {
    return this.viewPort.height;
  }

  pixel(x, y) {
    const startOffset = this.fullWidth * this.viewPort.y + this.viewPort.x;
    return this.fullPixels[startOffset + y * this.fullWidth + x];
  }

  draw(pixels) {
    const startOffset = this.fullWidth * this.viewPort.y + this.viewPort.x;
    for (let i = 0; i < pixels.length; i += 1) {
      const { x, y, color } = pixels[i];
      this.fullPixels[startOffset + y * this.fullWidth + x] = color;
    }
  }

  rescale(scale) {
    const minEdge = 4;
    const width = Math.max(Math.floor(this.fullWidth / scale), minEdge);
    const height = Math.max(Math.floor(this.fullHeight / scale), minEdge);
    this.viewPort = {
      x: Math.floor((this.fullWidth - width) / 2),
      y: Math.floor((this.fullHeight - height) / 2),
      width,
      height,
    };
  }
}

module.exports = {
  Picture,
};
