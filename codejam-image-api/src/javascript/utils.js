function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Image loading failed from url [${src}].`));
    };
    image.src = src;
  });
}

function requestImageSrcFromUnsplash(city) {
  const unsplashAccessKey = '6afe374906d700472e3a0fc5c79c6671edef4e13328d31796b751bb9e77edb0c';
  const unsplashUrl = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=${unsplashAccessKey}`;
  return fetch(unsplashUrl)
    .then((response) => response.json())
    .then((data) => data.urls.small);
}

module.exports = {
  loadImage,
  requestImageSrcFromUnsplash,
};
