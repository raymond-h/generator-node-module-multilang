'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var depsObject = require('deps-object');
var sortedObject = require('sorted-object');
var objectAssign = require('object-assign');
var mit = require('mit');

function nodeModuleName(filePath) {
	var basename = path.basename(filePath);

	if(basename.substr(0,5) === 'node-')
	basename = basename.substr(5);

	return basename;
}

var NodeModuleGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');

		if(!this.options['skip-install']) {
			this.npmInstall();
		}
	},

	prompting: function () {
		var self = this;

		// have Yeoman greet the user
		this.log(yosay('Coming up - a new node.js module!'));

		function isCompiled(answers) {
			return answers.language === 'coffee'
				|| answers.language === 'babel'
				|| answers.language === 'babel-node4';
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
					{ name: 'JavaScript (Babel, Node 4)', value: 'babel-node4' },
					{ name: 'CoffeeScript', value: 'coffee' }
				]
			},
			{
				type: 'confirm',
				name: 'experimental',
				message: 'Enable experimental (stage 0) features?',
				default: false,
				when: function(answers) { return answers.language === 'babel' || answers.language === 'babel-node4'; }
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
				type: 'confirm',
				name: 'addRepo',
				message: 'Do you want to set the repository in your package.json to a GitHub repo?',
				default: true
			},
			{
				type: 'input',
				name: 'username',
				message: 'What is your GitHub username?',
				default: function() {
					var defaultDone = this.async();
					try {
						self.user.github.username(function(err, username) {
							if(err) {
								return defaultDone(null, '');
							}
							defaultDone(null, username);
						});
					}
					catch(err) {
						// Catch, because something something no proper 'user.email'
						// being configured on git on Travis
						// causes an error that is NOT ultimately passed to the callback
						// of 'self.user.github.username()'
						defaultDone(null, '');
					}
				},
				when: function(answers) {
					return answers.useTravisCI || answers.addRepo;
				}
			},
		];

		return this.prompt(prompts)
			.then(function(answers) {
				for(var k in answers) {
					self[k] = answers[k];
				}

				self.compiled = isCompiled(answers);
			});
	},

	writingMainFiles: function () {
		switch(this.language) {
			case 'coffee':
				mkdirp.sync('src');
				this.copy('index.coffee', 'src/index.coffee');
				break;

			case 'babel': case 'babel-node4':
				this.template('_.babelrc', '.babelrc');
				this.template('_.eslintrc.json', '.eslintrc.json');
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
		this.fs.write('LICENSE', mit(this.author));
	},

	writingDevDeps: function() {
		function assignToDependencies(pkg, depObjName, deps) {
			var currentDeps = pkg[depObjName] || {};
			var newDepsObj = sortedObject(
				objectAssign(currentDeps, deps)
			);
			pkg[depObjName] = newDepsObj;
		}

		var devDeps = ['ava', 'onchange'];

		switch(this.language) {
			case 'coffee': devDeps.push('coffee-script', 'coffeelint'); break;

			case 'babel': case 'babel-node4':
				devDeps.push('babel-cli', 'babel-register', 'babel-eslint', 'eslint');

				if(this.language === 'babel-node4') { devDeps.push('babel-preset-es2015-node4'); }
				else { devDeps.push('babel-preset-es2015'); }

				if(this.experimental) { devDeps.push('babel-preset-stage-0'); }
				break;

			case 'js': devDeps.push('eslint'); break;
		}

		return depsObject(devDeps)
			.then(function(devDepsObj) {
				var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
				assignToDependencies(pkg, 'devDependencies', devDepsObj);
				this.fs.writeJSON(this.destinationPath('package.json'), pkg);
			}.bind(this));
	}
});

module.exports = NodeModuleGenerator;
