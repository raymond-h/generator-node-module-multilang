import test from 'ava';
import jsv from 'jsverify';
import { test as helpers } from 'yeoman-generator';
import path from 'path';

import { allExist, noneExist } from './_helpers';

function waitEnd(runContext) {
	return new Promise((resolve, reject) => {
		runContext.on('end', (err) => {
			if(err != null) return reject(err);

			resolve();
		});
	});
}

export function propertyTest(promptsArb, expectedExist, expectedNotExist = []) {
	return jsv.assert(
		jsv.forall(promptsArb, async (prompts) => {

			await waitEnd(
				helpers.run(path.join(__dirname, '../app'))
					.withOptions({ 'skip-install': true })
					.withPrompts(prompts)
			);

			return allExist(expectedExist)
				&& noneExist(expectedNotExist);
		}),
		{ tests: 5 }
	);
}

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

	await propertyTest(promptsArb, expected);
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

	await propertyTest(promptsArb, expected);
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

	await propertyTest(promptsArb, expected, ['src']);
});
