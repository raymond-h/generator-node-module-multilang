'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

function nodeModuleName(filePath) {
	var basename = path.basename(filePath);

	if(basename.substr(0,5) === 'node-')
	basename = basename.substr(5);

	return basename;
}

var NodeModuleGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require('../package.json');
	},

	getUsername: function() {
		var done = this.async();
		this.user.github.username(function(err, username) {
			if(err) {
				return done(err);
			}
			this.username = username;
			done();
		}.bind(this));
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		this.log(yosay('Coming up - a new node.js module!'));

		function isCompiled(answers) {
			return answers.language === 'coffee'
				|| answers.language === 'babel';
		}

		var prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'What is it called?',
				default: nodeModuleName(process.cwd())
			},
			{
				type: 'input',
				name: 'description',
				message: 'What is its description?',
				default: 'Out of the league!'
			},
			{
				type: 'input',
				name: 'author',
				message: 'Who is the author?',
				default: this.user.git.name()
			},
			{
				type: 'list',
				name: 'language',
				message: 'Which language should this module be written in?',
				choices: [
					{ name: 'JavaScript', value: 'js' },
					{ name: 'JavaScript (Babel)', value: 'babel' },
					{ name: 'CoffeeScript', value: 'coffee' }
				]
			},
			{
				type: 'confirm',
				name: 'experimental',
				message: 'Enable experimental (stage 0) features?',
				default: false,
				when: function(answers) { return answers.language === 'babel'; }
			},
			{
				type: 'confirm',
				name: 'publishSource',
				message: 'Should the original source be included as well when publishing to the npm registry?',
				default: false,
				when: isCompiled
			},
			{
				type: 'confirm',
				name: 'checkinCompiled',
				message: 'Should the compiled output be checked in to git as well?',
				default: false,
				when: isCompiled
			},
			{
				type: 'confirm',
				name: 'useTravisCI',
				message: 'Do you want to add a Travis CI config and README badge?',
				default: true
			},
			{
				type: 'input',
				name: 'username',
				message: 'What is your GitHub username?',
				default: this.username,
				when: function(answers) { return answers.useTravisCI; }
			},
		];

		this.prompt(prompts, function(answers) {
			for(var k in answers) {
				this[k] = answers[k];
			}

			this.compiled = isCompiled(answers);

			done();
		}.bind(this));
	},

	dependencies: function() {
		this.deps = [].concat(this.extraDeps);
	},

	module: function () {
		switch(this.language) {
			case 'coffee':
				mkdirp.sync('src');
				this.copy('index.coffee', 'src/index.coffee');
				break;

			case 'babel':
				this.template('_.babelrc', '.babelrc');
				mkdirp.sync('src');
				this.copy('index.js', 'src/index.js');
				break;

			case 'js':
				mkdirp.sync('lib');
				this.copy('index.js', 'lib/index.js');
				break;
		}

		mkdirp.sync('test');

		if(this.useTravisCI) {
			this.copy('.travis.yml', '.travis.yml');
		}

		this.template('_package.json', 'package.json');
		this.template('_.gitignore', '.gitignore');
		this.template('_.npmignore', '.npmignore');
		this.template('_README.md', 'README.md');

	},

	installDevDeps: function() {
		var devDeps = ['mocha', 'chai', 'onchange'];

		switch(this.language) {
			case 'coffee': devDeps.push('coffee-script', 'coffeelint'); break;
			case 'babel': devDeps.push('babel@5', 'eslint'); break;
			case 'js': devDeps.push('jshint'); break;
		}

		this.npmInstall(devDeps, { saveDev: true });
	}
});

module.exports = NodeModuleGenerator;
