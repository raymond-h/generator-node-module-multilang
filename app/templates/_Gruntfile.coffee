module.exports = (grunt) ->

	require('load-grunt-tasks')(grunt)

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		<% if(language === 'coffee') { %>
		coffee:
			build:
				expand: yes
				cwd: 'src/'
				src: '**/*.coffee'
				dest: 'lib/'
				ext: '.js'

		coffeelint:
			build:
				files: src: ['src/**/*.coffee', 'test/**/*.coffee']
			options:
				no_tabs: level: 'ignore' # this is tab land, boy
				indentation: value: 1 # single tabs
		<% }; %>

		mochaTest:
			test:
				options:
					reporter: 'spec'
					require: ['coffee-script/register']

				src: ['test/**/*.test.(js|coffee)']

		watch:
			dev:
				files: ['src/**/*.(js|coffee)', 'test/**/*.(js|coffee)']
				tasks: ['lint', 'test']

			test:
				files: ['src/**/*.(js|coffee)', 'test/**/*.(js|coffee)']
				tasks: ['test']

			lint:
				files: ['src/**/*.(js|coffee)', 'test/**/*.(js|coffee)']
				tasks: ['lint']

	grunt.registerTask 'default', ["build"]

	grunt.registerTask 'build', [
		'lint'
		'test'
		<% if(language === 'coffee') { %>'coffee:build'<% } %>
	]

	grunt.registerTask 'dev', ['lint', 'test']

	grunt.registerTask 'lint', [
		<% if(language === 'coffee') { %>'coffeelint:build'<% } else { %># Do some linting...<% } %>
	]
	grunt.registerTask 'test', ['mochaTest:test']

	grunt.registerTask 'watch-dev', ['watch:dev']