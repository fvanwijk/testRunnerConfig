'use strict';

var testFiles = require('./src/').getMochaFiles(require('./test/testFiles.js'));

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.task.renameTask('mocha_istanbul', 'mochaIstanbul');

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
    mochaIstanbul: {
      coverage: {
        src: testFiles,
        options: {
          coverageFolder: paths.test + '/coverage',
          mochaOptions: ['--require=babel-register'],
          check: {
            lines: 100,
            statements: 100,
            branches: 100,
            functions: 100
          }
        }
      }
    },
    mochaTest: {
      // Run without Grunt:
      // mocha test/specs --require babel-register
      test: {
        options: {
          require: 'babel-register'
        },
        src: testFiles
      }
    }
  });

  grunt.registerTask('test', ['mochaIstanbul']);
  grunt.registerTask('default', ['jshint', 'jscs', 'test']);
};
