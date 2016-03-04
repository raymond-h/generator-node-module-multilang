/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('node-module generator', function() {
	it('creates expected files for Coffee', function(done) {
		var expected = [
            'src/index.coffee',
			'test',
			'.gitignore',
			'.npmignore',
			'package.json',
			'README.md'
		];

		var prompts = {
			'name': 'pizza-slicer',
			'description': 'A lightweight module for slicing pizzas!',
			'author': 'John Dough',
			'language': 'coffee',
			'publishSource': false,
			'checkinCompiled': false,
            'useTravisCI': false
		};

		helpers.run(path.join(__dirname, '../app'))
			.withOptions({ 'skip-install': true })
			.withPrompts(prompts)
			.on('end', (err) => {
				if(err != null) return done(err);

				assert.file(expected);
				done();
			});
	});
});
