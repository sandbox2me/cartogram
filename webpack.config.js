var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: './src/index',
    output: {
        path: './dist/',
        filename: 'cartogram.js',
        library: 'Cartogram',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader" }
        ]
    },
    plugins: [],
    externals: {
        // Don't bundle in THREE
        'three': 'THREE',
        'lodash': '_'
    }
};
