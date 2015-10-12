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

  var wallabyFiles = files.map(function (group) {
    return {
      type: group.type,
      files: group.files.map(mappings[group.type])
    };
  });

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

module.exports = {
  getWallabyFiles: getWallabyFiles,
  getKarmaFiles: files => _(files)
    .values()
    .flatten()
    .value
};
