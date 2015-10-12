# Test Runner Config

When you run your unit tests using both Karma and Wallaby, a lot of configuration such as the files list is duplicated.
We like DRY, so put the files in a separate file list and load them into your Wallaby and Karma config using this script!

# Usage

Install this node module into your project.

```
npm i test-runner-config --save-dev
```

Require testRunnerConfig in your karma.conf.js or wallaby.conf.js file.

```javascript
var testRunnerConfig = require('testRunnerConfig');
```

Pass a file list to a testRunnerConfig method to get your configuration.

```javascript
var config = testRunnerConfig.getWallabyFiles(files); // For Karma call getKarmaFiles()
```

`config` contains the part of your Wallaby config with the files and specs, which you can merge into your Wallaby config object:

```javascript
{
  files: ...,
  tests: ...
}
```

The file list should have the following format:

```json
[{
  "type": "src",
  "files": [
    "src/*.js" // any glob pattern
  ]
},
{
  "type": "specs",
  "files": [
    "test/specs/*.js"
  ]
}]
```

The arrays with file patterns will be mapped onto the new data structure using default mappings.
You can override the mapping per type by passing a mapping object as second argument.
The following example shows you the default mappings.

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
