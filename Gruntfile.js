module.exports = function(grunt) {
    'use strict';

    var webpack = require('webpack'),
        webpackConfig = require('./webpack.config.js')

    require('load-grunt-tasks')(grunt, { pattern: [
        'grunt-*'
    ]});

    grunt.initConfig({
        webpack: {
            options: webpackConfig,
            production: {
                plugins: webpackConfig.plugins.concat(
					new webpack.DefinePlugin({
						"process.env": {
							// This has effect on the react lib size
							"NODE_ENV": JSON.stringify("production")
						}
					}),
					new webpack.optimize.DedupePlugin(),
					new webpack.optimize.UglifyJsPlugin()
				)
            },
            dev: {
                output: {
                    path: 'dist/',
                    filename: 'cartogram-dev.js',
                    library: 'Cartogram',
                    libraryTarget: 'umd'
                },
                devtool: 'sourcemap',
                debug: true
            }
        },
        watch: {
            lib: {
                files: ['src/**/*'],
                tasks: ['webpack:dev'],
                options: {
                    spawn: false
                }
            }
        },
        'http-server': {
            dev: {
                root: __dirname,
                port: 8080,
                host: '0.0.0.0',
                showDir: true
            }
        },
        'concurrent': {
            dev: {
                tasks: ['dev-watch', 'http-server'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('dev-watch', [
        'webpack:dev',
        'watch:lib'
    ]);

    grunt.registerTask('dev', [
        'concurrent:dev'
    ]);

    grunt.registerTask('default', [
        'webpack:production'
    ]);

};
