const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer-stylus');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public/build'),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      objects: path.join(__dirname, 'src/objects'),
      models: path.join(__dirname, 'src/models'),
      shaders: path.join(__dirname, 'src/shaders'),
      scenes: path.join(__dirname, 'src/scenes'),
      lib: path.join(__dirname, 'src/lib')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('css-loader!stylus-loader') }
    ]
  },
  stylus: {
    use: [
      autoprefixer()
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css')
  ]
};
