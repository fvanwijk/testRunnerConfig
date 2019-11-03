var testRunnerConfig = require('./src');
var wallabyFiles = testRunnerConfig.getWallabyFiles(
  require('./test/testFiles.js')
);

module.exports = function() {
  return {
    files: wallabyFiles.files,
    tests: wallabyFiles.tests,
    testFramework: 'mocha',
    env: {
      type: 'node'
    }
  };
};
