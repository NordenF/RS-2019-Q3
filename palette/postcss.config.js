const autoprefixerPlugin = require('autoprefixer');
const cssnanoPlugin = require('cssnano');

// It is handy to not have those transformations while we developing
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    plugins: [
      autoprefixerPlugin,
      cssnanoPlugin,
      // More postCSS modules here if needed
    ],
  };
}
