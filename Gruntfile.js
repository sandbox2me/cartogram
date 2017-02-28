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
					new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            unused: true,
                            dead_code: true,
                            drop_debugger: true,
                            drop_console: true,
                        }
                    })
				)
            },
            dev: {
                devtool: 'inline-source-map',
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
            },
            prod: {
                files: ['src/**/*'],
                tasks: ['webpack:production'],
                options: {
                    spawn: false
                }
            }
        },
        'http-server': {
            dev: {
                root: __dirname,
                port: 8081,
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
        },
        'jasmine_webpack': {
            main: {
                options: {
                    specRunnerDest: 'SpecRunner.html',
                    webpack: {
                        module: {
                            loaders: [
                                { test: /\.js$/, loader: 'babel-loader?stage=0' },
                                { test: /\.glsl$/, loader: 'raw-loader' }
                            ]
                        },
                        resolve: {
                            root: './src'
                        }
                    },
                    keepRunner: true,
                    vendor: [],
                    styles: []
                },
                src: './src/**/*.spec.js'
            }
        }
    });

    grunt.registerTask('dev-watch', [
        'webpack:dev',
        'watch:lib'
    ]);
    grunt.registerTask('prod-watch', [
        'webpack:production',
        'watch:prod'
    ]);

    grunt.registerTask('dev', [
        'concurrent:dev'
    ]);

    grunt.registerTask('default', [
        'webpack:production'
    ]);

    grunt.registerTask('test', [
        'jasmine_webpack'
    ]);

};
