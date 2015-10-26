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

function getFilesList(files, typeToExclude, isExclude) {
  return _(files)
    [isExclude ? 'where' : 'reject']({ type: typeToExclude })
    .pluck('files')
    .values()
    .flatten()
    .value();
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
  var ignoreIndex = _.findIndex(files, { type: 'ignore' });
  var specs = _.findWhere(files, { type: 'specs' }).files;
  if (files[ignoreIndex]) {
    files[ignoreIndex].files = files[ignoreIndex].files.concat(specs);
  } else {
    files.push({ type: 'ignore', files: specs });
  }

  var wallabyFiles = files.map(applyMappings(mappings));

  return {
    files: getFilesList(wallabyFiles, 'specs', false),
    tests: getFilesList(wallabyFiles, 'specs', true)
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
    files: getFilesList(wallabyFiles, 'ignore', false),
    exclude: getFilesList(wallabyFiles, 'ignore', true)
  };
}

function getMochaFiles(files, mappings) {
  return getKarmaFiles(files, mappings).files;
}

module.exports = {
  getWallabyFiles: getWallabyFiles,
  getKarmaFiles: getKarmaFiles,
  getMochaFiles: getMochaFiles
};
