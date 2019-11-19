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

function fill(picture, pos, color) {
  const targetColor = picture.pixel(pos.x, pos.y);
  const pixelsToDraw = [
    {
      x: pos.x,
      y: pos.y,
      color,
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
      if (x >= 0 && x < picture.width && y >= 0 && y < picture.height
        && picture.pixel(x, y) === targetColor
        && !pixelsToDraw.some((p) => p.x === x && p.y === y)
      ) {
        pixelsToDraw.push({
          x, y, color,
        });
      }
    }
  }

  return pixelsToDraw;
}

module.exports = {
  fill,
};
