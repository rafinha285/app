'use strict'
const path = require('path');
const webpack = require('webpack')
module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {
      "constants": require.resolve("constants-browserify")
    }
  },
};
