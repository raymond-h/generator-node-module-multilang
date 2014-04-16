/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('node-module generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('node-module:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'src',
      'test',
      '.gitignore',
      '.npmignore',
      'Gruntfile.coffee',
      'package.json'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'pizza-slicer',
      'description': 'A lightweight module for slicing pizzas!',
      'author': 'John Dough',
      'language': 'coffee',
      'publishSource': false,
      'checkinCompiled': false,
      'extraDeps': ['underscore', 'q', 'request']
    });

    this.app.options['skip-install'] = true;

    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
