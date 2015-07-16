'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var npm = require('npm');

function nodeModuleName(filePath) {
	var basename = path.basename(filePath);

	if(basename.substr(0,5) === 'node-')
		basename = basename.substr(5);

	return basename;
}

var NodeModuleGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require('../package.json');

		this.on('end', function () {
			if (!this.options['skip-install']) {
				this.installDependencies();
			}
		});
	},

	loadNpm: function() {
		var done = this.async();

		npm.load(function(err, npm) {
			this.npm = npm;
			done();
		}.bind(this));
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		this.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('Coming up - a new node.js module!'));

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
				default: this.npm.config.get('init.author.name')
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
			}
		];

		this.prompt(prompts, function(answers) {
			for(var k in answers) {
				this[k] = answers[k];
			}

			this.compiled = isCompiled(answers)

			done();
		}.bind(this));
	},

	dependencies: function() {
		this.deps = [].concat(this.extraDeps);
	},

	module: function () {
		switch(this.language) {
			case 'coffee':
				this.mkdir('src');
				this.copy('index.coffee', 'src/index.coffee');
				break;

			case 'babel':
				this.mkdir('src');
				this.copy('index.js', 'src/index.js');
				break;

			case 'js':
				this.mkdir('lib');
				this.copy('index.js', 'lib/index.js');
				break;
		}

		this.mkdir('test');

		this.template('_package.json', 'package.json');
		this.template('_.gitignore', '.gitignore');
		this.template('_.npmignore', '.npmignore');
		this.template('_README.md', 'README.md');
	}
});

module.exports = NodeModuleGenerator;