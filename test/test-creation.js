import test from 'ava';
import path from 'path';
import assert from 'yeoman-assert';
import { test as helpers } from 'yeoman-generator';

function waitEnd(runContext) {
	return new Promise((resolve, reject) => {
		runContext.on('end', (err) => {
			if(err != null) reject(err);
			else resolve();
		});
	});
}

test('creates expected files for Coffee', async t => {
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

	await waitEnd(
		helpers.run(path.join(__dirname, '../app'))
			.withOptions({ 'skip-install': true })
			.withPrompts(prompts)
	);

	assert.file(expected);
});
