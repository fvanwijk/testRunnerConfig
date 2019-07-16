'use strict';

var testFiles = require('./src/').getMochaFiles(require('./test/testFiles.js'));

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var paths = {
    src: 'src',
    dist: 'dist',
    test: 'test'
  };

  grunt.initConfig({
    jscs: {
      options: {
        config: './.jscsrc'
      },
      src: {
        src: paths.src + '/**/*.js'
      },
      test: {
        src: testFiles
      },
      config: {
        src: '*.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: {
        src: paths.src + '/**/*.js'
      },
      test: {
        src: testFiles
      },
      config: {
        src: '*.js'
      }
    },
    mochaTest: {
      // Run without Grunt:
      // mocha test/specs --require babel-register
      test: {
        options: {
          //require: 'babel-register'
        },
        src: testFiles
      }
    }
  });

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'jscs', 'test']);
};
