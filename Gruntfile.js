module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, { pattern: [
        'grunt-*'
    ]});

    // load local tasks
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [
        'build'
    ]);

};
