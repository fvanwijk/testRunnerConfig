'use strict';

const wallabyObject = (instrument, load, ignore) => file => ({
  pattern: file,
  instrument: instrument,
  load: load,
  ignore: ignore
});

const instrument = wallabyObject(true, true, false);
const notInstrument = wallabyObject(false, true, false);

const applyMappings = mappings => group => ({
  type: group.type,
  files: group.files.map(mappings[group.type] || (file => file))
});

const getFilesList = (files, typeToExclude, isExclude) => {
  return [].concat(
    ...files
      .filter(file =>
        isExclude ? file.type === typeToExclude : file.type !== typeToExclude
      )
      .map(file => file.files)
  );
};

const getWallabyFiles = (files, mappings) => {
  if (!files) {
    return {};
  }

  // Add 'specs' list to files as 'ignored'. If we had added them manually to the ignore list, Karma has no specs to run.
  let ignoreIndex = files.findIndex(file => file.type === 'ignore');
  let specs = files.find(file => file.type === 'specs');
  specs = specs ? specs.files : [];

  if (files[ignoreIndex]) {
    files[ignoreIndex].files = files[ignoreIndex].files.concat(specs);
  } else {
    files.push({ type: 'ignore', files: specs });
  }

  let wallabyFiles = files.map(
    applyMappings({
      config: notInstrument,
      ignore: wallabyObject(false, false, true),
      lib: notInstrument,
      mock: wallabyObject(false, false, false),
      specs: instrument,
      src: instrument,
      ...mappings
    })
  );

  return {
    files: getFilesList(wallabyFiles, 'specs', false),
    tests: getFilesList(wallabyFiles, 'specs', true)
  };
};

const getKarmaFiles = (files, mappings) => {
  if (!files) {
    return {};
  }

  let karmaFiles = files.map(
    applyMappings({
      mock: file => ({
        pattern: file,
        included: false
      }),
      ...mappings
    })
  );

  return {
    files: getFilesList(karmaFiles, 'ignore', false),
    exclude: getFilesList(karmaFiles, 'ignore', true)
  };
};

const getMochaFiles = (files, mappings) => {
  return getKarmaFiles(files, mappings).files;
};

module.exports = {
  getWallabyFiles: getWallabyFiles,
  getKarmaFiles: getKarmaFiles,
  getMochaFiles: getMochaFiles
};
