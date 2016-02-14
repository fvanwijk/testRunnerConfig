'use strict';

const _ = require('lodash');
let instrument = function (file) {
  return {
    pattern: file,
    instrument: true,
    load: true,
    ignore: false
  };
};
let notInstrument = function (file) {
  return {
    pattern: file,
    instrument: false,
    load: true,
    ignore: false
  };
};

function applyMappings(mappings) {
  return (group) => ({
    type: group.type,
    files: group.files.map(mappings[group.type] || _.identity)
  });
}

function getFilesList(files, typeToExclude, isExclude) {
  return _(files)
    [isExclude ? 'filter' : 'reject']({ type: typeToExclude })
    .map('files')
    .values()
    .flatten()
    .value();
}

function getWallabyFiles(files, mappings) {
  if (!files) {
    return {};
  }

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
  let ignoreIndex = _.findIndex(files, { type: 'ignore' });
  let specs = _.result(_.find(files, { type: 'specs' }), 'files', []);
  if (files[ignoreIndex]) {
    files[ignoreIndex].files = files[ignoreIndex].files.concat(specs);
  } else {
    files.push({ type: 'ignore', files: specs });
  }

  let wallabyFiles = files.map(applyMappings(mappings));

  return {
    files: getFilesList(wallabyFiles, 'specs', false),
    tests: getFilesList(wallabyFiles, 'specs', true)
  };
}

function getKarmaFiles(files, mappings) {
  if (!files) {
    return {};
  }

  mappings = _.defaults(mappings || {}, {
    mock: (file) => ({
      pattern: file,
      included: false
    })
  });

  let karmaFiles = files.map(applyMappings(mappings));

  return {
    files: getFilesList(karmaFiles, 'ignore', false),
    exclude: getFilesList(karmaFiles, 'ignore', true)
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
