'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

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

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		this.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('Coming up - a new node.js module!'));

		var prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'What is it called?',
				default: nodeModuleName(process.cwd())
			},
			{
				type: 'list',
				name: 'language',
				message: 'Which language should this module be written in?',
				choices: [
					{ name: 'JavaScript', value: 'js' },
					{ name: 'CoffeeScript', value: 'coffee' }
				]
			}
		];

		this.prompt(prompts, function (props) {
			for(var k in props) {
				this[k] = props[k];
			}

			done();
		}.bind(this));
	},

	app: function () {
		// this.mkdir('app');
		// this.mkdir('app/templates');

		// this.copy('_package.json', 'package.json');
		// this.copy('_bower.json', 'bower.json');
	},

	projectfiles: function () {
		// this.copy('editorconfig', '.editorconfig');
		// this.copy('jshintrc', '.jshintrc');
	}
});

module.exports = NodeModuleGenerator;