module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, { pattern: [
        'grunt-*'
    ]});

    // load js-common tasks
    require('js-common/src/tasks/release')(grunt);

    // load local tasks
    grunt.loadTasks('tasks');

};
