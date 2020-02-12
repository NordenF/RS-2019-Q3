require('../sass/styles.scss');

// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
require('file-loader?name=[name].[ext]!../index.html');

require('./index');
