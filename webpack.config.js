var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: './src/index',
    output: {
        path: './dist/',
        filename: 'cartogram.js',
        library: 'cartogram2',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader?stage=0' },
            { test: /\.glsl$/, loader: 'raw-loader' }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src')
    },
    plugins: [],
};
