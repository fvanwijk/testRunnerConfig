# Test Runner Config

When you run your unit tests using both Karma and Wallaby, a lot of configuration such as the files list is duplicated.
We like DRY, so put the files in a separate file list and load them into your Wallaby and Karma config using this script!

# Usage

Install this node module into your project.

```
npm i test-runner-config --save-dev
```

Require testRunnerConfig in your karma.conf.js or wallaby.conf.js file and pass a structured file list to a `testRunnerConfig` method to get your configuration.
Mocha is not supported because it passes the files as argument to the `mocha` command, but you can get a files list for the Grunt or Gulp task that runs Mocha.

The file list should have the following format. You can use glob patterns, but note that Wallaby does not support them all.
See [Wallaby issue 69](https://github.com/wallabyjs/public/issues/69)

```json
[{
  "type": "lib",
  "files": ["node_modules/angular/angular.js"]
},
{
  "type": "src",
  "files": ["src/*.js"]
},
{
  "type": "specs",
  "files": ["test/specs/*.js"]
}]
```

```javascript
var testRunnerConfig = require('test-runner-config');
var config = testRunnerConfig.getWallabyFiles(files); // For Karma config call getKarmaFiles() and for Mocha call getMochaFiles()
```

`config` contains the part of your Wallaby config with the files and specs, which you can merge into your Wallaby config object.
To get the files array for the Mocha grunt or Gulp task, call `testRunnerConfig.getMochaFiles(require('./test/testFiles.js'))`.

This is now in the `config` variable.

```javascript
{
  files: [
    { pattern: 'node_modules/angular/angular.js', load: true, instrument: false, ignore: false },
    { pattern: 'src/*.js', load: true, instrument: true, ignore: false }
  ],
  tests: [
    { pattern: 'test/specs/*.js', load: true, instrument: true, ignore: false }
  ]
}
```

The arrays with file patterns will be mapped onto the new data structure using default mappings.
You can override the mapping per type by passing a mapping object as second argument.
The following example shows you the default mappings passed explicitely.

```javascript
var config = testRunnerConfig.getWallabyFiles(files, {
  config: function (file) { return { pattern: file, instrument: false, load: true, ignore: false }; },
  ignore: function (file) { return { pattern: file, instrument: false, load: false, ignore: true }; },
  lib: function (file) { return { pattern: file, instrument: false, load: true, ignore: false }; },
  mock: function (file) { return { pattern: file, instrument: false, load: false, ignore: false }; },
  specs: function (file) { return { pattern: file, instrument: true, load: true, ignore: false }; },
  src: function (file) { return { pattern: file, instrument: true, load: true, ignore: false }; },
});
```

Note that if you have set defaults in your Wallaby config file, these will be overridden by the default mappings.
