'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var appConfig = {
    src: 'src',
    dist: 'dist'
  };

  grunt.initConfig({

    paths: appConfig,

    watch: {
      js: {
        files: ['<%= paths.src %>/**/*.js', 'Gruntfile.js'],
        tasks: ['newer:jshint:src', 'newer:jscs:src']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: {
        src: [
          'Gruntfile.js',
          '<%= paths.src %>/**/*.js'
        ]
      }
    },

    jscs: {
      options: {
        config: './.jscsrc'
      },
      src: {
        src: ['<%= paths.src %>/scripts/**/*.js']
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'jscs'
  ]);
};
