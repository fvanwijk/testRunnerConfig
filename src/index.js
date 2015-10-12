var _ = require('lodash');
var instrument = function (file) {
  return {
    pattern: file,
    instrument: true,
    load: true,
    ignore: false
  };
};
var notInstrument = function (file) {
  return {
    pattern: file,
    instrument: false,
    load: true,
    ignore: false
  };
};

function applyMappings(mappings) {
  return function (group) {
    return {
      type: group.type,
      files: group.files.map(mappings[group.type] || _.identity)
    };
  }
}

function getWallabyFiles(files, mappings) {
  mappings = _.defaults(mappings || {}, {
    config: notInstrument,
    ignore: function (file) {
      return {
        pattern: file,
        instrument: false,
        load: false,
        ignore: true
      };
    },
    lib: notInstrument,
    mock: function (file) {
      return {
        pattern: file,
        instrument: false,
        load: false,
        ignore: false
      };
    },
    specs: instrument,
    src: instrument
  });

  // Add 'specs' list to files as 'ignored'. If we had added them manually to the ignore list, Karma has no specs to run.
  var specs = _.findWhere(files, { type: 'specs' }).files;
  var ignoreIndex = _.findIndex(files, { type: 'ignore' });
  files[ignoreIndex].files = files[ignoreIndex].files.concat(specs);

  var wallabyFiles = files.map(applyMappings(mappings));

  return {
    files: _(wallabyFiles)
      .reject({ type: 'specs' })
      .pluck('files')
      .values()
      .flatten()
      .value(),
    tests: _.result(_.findWhere(wallabyFiles, { type: 'specs' }), 'files')
  };
}

function getKarmaFiles(files, mappings) {
  mappings = _.defaults(mappings || {}, {
    mock: function (file) {
      return {
        pattern: file,
        included: false
      };
    }
  });

  var karmaFiles = files.map(applyMappings(mappings));

  return {
    files: _(karmaFiles)
      .reject({ type: 'ignore' })
      .pluck('files')
      .values()
      .flatten()
      .value(),
    exclude: _.result(_.findWhere(karmaFiles, { type: 'ignore' }), 'files')
  };
}

module.exports = {
  getWallabyFiles: getWallabyFiles,
  getKarmaFiles: getKarmaFiles
};
