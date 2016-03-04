import test from 'ava';
import jsv from 'jsverify';
import { test as helpers } from 'yeoman-generator';
import path from 'path';

import { allExist, noneExist } from './_helpers';

function runWithPrompts(prompts) {
	return new Promise((resolve, reject) => {
		helpers.run(path.join(__dirname, '../app'))
		.withOptions({ 'skip-install': true })
		.withPrompts(prompts)

		.on('end', (err) => {
			if(err != null) return reject(err);
			resolve();
		});
	});
}

const verifyTestCount = 5;

// *** TESTS

test.serial('creates expected files for Coffee', async t => {
	const promptsArb = jsv.record({
		'name': jsv.nestring,
		'description': jsv.nestring,
		'author': jsv.nestring,
		'language': jsv.constant('coffee'),
		'publishSource': jsv.bool,
		'checkinCompiled': jsv.bool,
		'useTravisCI': jsv.constant(false)
	});

	const expected = [
		'src/index.coffee',
		'test',
		'.gitignore',
		'.npmignore',
		'package.json',
		'README.md'
	];

	await jsv.assert(
		jsv.forall(promptsArb, async (prompts) => {
			await runWithPrompts(prompts);

			return allExist(expected);
		}),
		{ tests: verifyTestCount }
	);
});

test.serial('creates expected files for Babel', async t => {
	const promptsArb = jsv.record({
		'name': jsv.nestring,
		'description': jsv.nestring,
		'author': jsv.nestring,
		'language': jsv.constant('babel'),
		'experimental': jsv.bool,
		'publishSource': jsv.bool,
		'checkinCompiled': jsv.bool,
		'useTravisCI': jsv.constant(false)
	});

	const expected = [
		'src/index.js',
		'test',
		'.gitignore',
		'.npmignore',
		'package.json',
		'README.md'
	];

	await jsv.assert(
		jsv.forall(promptsArb, async (prompts) => {
			await runWithPrompts(prompts);

			return allExist(expected);
		}),
		{ tests: verifyTestCount }
	);
});

test.serial('creates expected files for vanilla Javascript', async t => {
	const promptsArb = jsv.record({
		'name': jsv.nestring,
		'description': jsv.nestring,
		'author': jsv.nestring,
		'language': jsv.constant('js'),
		'useTravisCI': jsv.constant(false)
	});

	const expected = [
		'lib/index.js',
		'test',
		'.gitignore',
		'.npmignore',
		'package.json',
		'README.md'
	];

	await jsv.assert(
		jsv.forall(promptsArb, async (prompts) => {
			await runWithPrompts(prompts);

			return allExist(expected) && noneExist(['src']);
		}),
		{ tests: verifyTestCount }
	);
});
