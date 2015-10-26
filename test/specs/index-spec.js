var expect = require('chai').expect;
var testRunnerConfig = require('../../src/');

// Create pattern object
var p = (pattern, instrument, load, ignore) => ({
  pattern: pattern,
  instrument: instrument,
  load: load,
  ignore: ignore
});

describe('the getKarmaFiles() method', function() {
  var getFiles;

  beforeEach(function () {
    getFiles = testRunnerConfig.getKarmaFiles;
  });

  it('should return {} when passing nothing', function () {
    expect(getFiles()).to.eql({});
  });

  it('should return empty files / exclude list when passing no files or ignores', function () {
    expect(getFiles([])).to.eql({
      files: [],
      exclude: []
    })
  });

  describe('the default pattern mappings', function () {
    // There are currently no pattern mappings for all types except mock in karma
    it('should map files of type x to "files", and files of type ignore to "exclude", without pattern object', function () {
      expect(getFiles([
        { type: 'x', files: ['xfile'] },
        { type: 'z', files: ['yfile'] },
        { type: 'ignore', files: ['ignorefile'] }
      ])).to.eql({
        files: ['xfile', 'yfile'],
        exclude: ['ignorefile']
      });
    });

    it('should map files of type mock to a pattern that is not included', function () {
      expect(getFiles([{ type: 'mock', files: ['mockfile'] }])).to.eql({
        files: [{ pattern: 'mockfile', included: false }],
        exclude: []
      });
    });
  });

  it('should merge multiple file lists that have type ignore', function () {
    expect(getFiles([
      { type: 'ignore', files: ['ignore1'] },
      { type: 'ignore', files: ['ignore2'] }
    ])).to.eql({
      files: [],
      exclude: ['ignore1', 'ignore2']
    });
  });
});

describe('the getMochaFiles method', function () {
  it('should return undefined when passing nothing', function () {
    expect(testRunnerConfig.getMochaFiles()).to.eql(undefined);
  });

  it('should return empty array when passing empty file list', function () {
    expect(testRunnerConfig.getMochaFiles([])).to.eql([]);
  });

  describe('the default pattern mappings', function () {
    it('should return the files list for the getKarmaFiles result', function () {
      expect(testRunnerConfig.getMochaFiles([
        { type: 'x', files: ['xfile'] },
        { type: 'z', files: ['yfile'] },
        { type: 'mock', files: ['mockfile'] },
        { type: 'ignore', files: ['ignorefile1'] },
        { type: 'ignore', files: ['ignorefile2'] }
      ])).to.eql(['xfile', 'yfile', { pattern: 'mockfile', included: false }]);
    });
  });
});

describe('the getWallabyFiles method', function () {
  var getFiles = testRunnerConfig.getWallabyFiles;

  it('should return {} when passing nothing', function () {
    expect(getFiles()).to.eql({});
  });

  it('should return empty files / exclude list when passing no files or ignores', function () {
    expect(getFiles([])).to.eql({
      files: [],
      tests: []
    })
  });

  describe('the default pattern mappings', function () {
    it('should map files of type config to "files" with pattern instrument: false, load: true, ignore: false', function () {
      expect(getFiles([
        { type: 'config', files: ['configfile'] }
      ])).to.eql({
          files: [p('configfile', false, true, false)],
          tests: []
        });
    });

    it('should map files of type ignore to "files" with pattern ignore: true', function () {
      expect(getFiles([
        { type: 'ignore', files: ['ignorefile'] }
      ])).to.eql({
        files: [p('ignorefile', false, false, true)],
        tests: []
      });
    });

    it('should map files of type lib to "files" with pattern instrument: false, load: true, ignore: false', function () {
      expect(getFiles([
        { type: 'lib', files: ['libfile'] }
      ])).to.eql({
        files: [p('libfile', false, true, false)],
        tests: []
      });
    });

    it('should map files of type mock to "files" with pattern instrument: false, load: false, ignore: false', function () {
      expect(getFiles([
        { type: 'mock', files: ['mockfile'] }
      ])).to.eql({
        files: [p('mockfile', false, false, false)],
        tests: []
      });
    });

    it('should map files of type spec to "specs" with pattern instrument: false, load: false, ignore: false and is ignored in the files list', function () {
      expect(getFiles([
        { type: 'specs', files: ['specfile'] }
      ])).to.eql({
        files: [p('specfile', false, false, true)],
        tests: [p('specfile', true, true, false)]
      });
    });

    it('should add specs to the ignore list also when there are already files defined in that list', function () {
      expect(getFiles([
        { type: 'src', files: ['srcfile'] },
        { type: 'specs', files: ['specfile'] }
      ])).to.eql({
          files: [
            p('srcfile', true, true, false),
            p('specfile', false, false, true)
          ],
          tests: [p('specfile', true, true, false)]
        });
    });

    it('should map files of type src to "files" with pattern instrument: true, load: true, ignore: false', function () {
      expect(getFiles([
        { type: 'src', files: ['srcfile'] }
      ])).to.eql({
        files: [p('srcfile', true, true, false)],
        tests: []
      });
    });
  });

  describe('overriding pattern mappings', function () {
    it('should override all pattern mappings when passed', function () {
      var createFakeMapping = (mappingName) =>
        (x) => [mappingName, x];

      expect(getFiles([
        { type: 'config', files: ['configfile'] },
        { type: 'ignore', files: ['ignorefile'] },
        { type: 'lib', files: ['libfile'] },
        { type: 'mock', files: ['mockfile'] },
        { type: 'specs', files: ['specfile'] },
        { type: 'src', files: ['srcfile'] }
      ], {
        config: createFakeMapping('config'),
        ignore: createFakeMapping('ignore'),
        lib: createFakeMapping('lib'),
        mock: createFakeMapping('mock'),
        specs: createFakeMapping('specs'),
        src: createFakeMapping('src')
      })).to.eql({
          // Format: ['used mapping fn', 'filename']
          files: [['config', 'configfile'], ['ignore', 'ignorefile'], [ 'ignore', 'specfile'], ['lib', 'libfile'], ['mock', 'mockfile'], ['src', 'srcfile']],
          tests: [['specs', 'specfile']]
        });
    });
  });
});
