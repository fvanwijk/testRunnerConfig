'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var appConfig = {
    src: 'src',
    dist: 'dist',
    test: 'test'
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
    },

    mochaTest: {
      // Run without Grunt:
      // mocha test/specs --require babel/register
      test: {
        options: {
          ui: 'bdd',
          require: 'babel/register'
        },
        src: require('./src/').getMochaFiles(require('./test/testFiles.js'))
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commitFiles: ['package.json'],
        commitMessage: 'Bump version to v%VERSION%',
        push: false
      }
    }
  });

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'jscs', 'test']);
};
