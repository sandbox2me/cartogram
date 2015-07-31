module.exports = function(grunt) {
    'use strict';

    var _ = require('underscore'),
        config = require('../src/require_config');

    grunt.config.set('requirejs', {
        dist: {
            options: _.extend({}, config, {
                baseUrl: '.',
                name: 'main',
                out: 'dist/cartogram.js',
                findNestedDependencies: true,
                useStrict: true,
                // We should uglify in a separate process
                // Optimizing here causes the build to take almost 4 minutes
                optimize: 'none',
                logLevel: 3,
                generateSourceMaps: true,
                preserveLicenseComments: true
            })
        }
    });

    grunt.registerTask('build', [
        'requirejs'
    ]);
};
