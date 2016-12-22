import test from 'ava';
import jsv from 'jsverify';
import helpers from 'yeoman-test';
import path from 'path';
import fs from 'fs';
import loadJsonFile from 'load-json-file';

import { allExist, noneExist } from './_helpers';

function runWithPrompts(prompts) {
    return helpers.run(path.join(__dirname, '../app'))
        .withOptions({ 'skip-install': true })
        .withPrompts(prompts)
        .toPromise();
}

const verifyTestCount = 5;

// *** TESTS

test.serial('creates expected files for Coffee', async t => {
    const promptsArb = jsv.record({
        'name': jsv.asciinestring,
        'description': jsv.nestring,
        'author': jsv.nestring,
        'language': jsv.constant('coffee'),
        'publishSource': jsv.bool,
        'checkinCompiled': jsv.bool,
        'useTravisCI': jsv.bool,
        'addRepo': jsv.bool,
        'username': jsv.asciinestring
    });

    const expected = [
        'src/index.coffee',
        'test/test.coffee',
        '.gitignore',
        '.npmignore',
        'package.json',
        'README.md',
        'LICENSE'
    ];

    await jsv.assert(
        jsv.forall(promptsArb, async (prompts) => {
            await runWithPrompts(prompts);
            const pkgJson = await loadJsonFile('package.json');

            return allExist(expected) &&
                /coffeelint/i.test(pkgJson.scripts.lint) &&
                /ava/i.test(pkgJson.scripts.test) &&
                /coffee/i.test(pkgJson.scripts.build) &&
                /build/i.test(pkgJson.scripts.prepublish) &&
                /onchange/i.test(pkgJson.scripts.watch) &&
                /watch/i.test(pkgJson.scripts.dev)
            ;
        }),
        { tests: verifyTestCount }
    );
});

test.serial('creates expected files for Babel', async t => {
    const promptsArb = jsv.record({
        'name': jsv.asciinestring,
        'description': jsv.nestring,
        'author': jsv.nestring,
        'language': jsv.constant('babel'),
        'experimental': jsv.bool,
        'publishSource': jsv.bool,
        'checkinCompiled': jsv.bool,
        'useTravisCI': jsv.bool,
        'addRepo': jsv.bool,
        'username': jsv.asciinestring
    });

    const expected = [
        'src/index.js',
        'test/test.js',
        '.babelrc',
        '.gitignore',
        '.npmignore',
        '.eslintrc.json',
        'package.json',
        'README.md',
        'LICENSE'
    ];

    await jsv.assert(
        jsv.forall(promptsArb, async (prompts) => {
            await runWithPrompts(prompts);
            const babelrc = await loadJsonFile('.babelrc');
            const pkgJson = await loadJsonFile('package.json');

            return allExist(expected) &&
                babelrc.presets.indexOf('es2015') > -1 &&
                babelrc.plugins.indexOf('transform-runtime') > -1 &&
                /eslint/i.test(pkgJson.scripts.lint) &&
                /ava/i.test(pkgJson.scripts.test) &&
                /babel/i.test(pkgJson.scripts.build) &&
                /build/i.test(pkgJson.scripts.prepublish) &&
                /onchange/i.test(pkgJson.scripts.watch) &&
                /watch/i.test(pkgJson.scripts.dev)
            ;
        }),
        { tests: verifyTestCount }
    );
});

test.serial('creates expected files for Babel with Node 4 preset', async t => {
    const promptsArb = jsv.record({
        'name': jsv.asciinestring,
        'description': jsv.nestring,
        'author': jsv.nestring,
        'language': jsv.constant('babel-node4'),
        'experimental': jsv.bool,
        'publishSource': jsv.bool,
        'checkinCompiled': jsv.bool,
        'useTravisCI': jsv.bool,
        'addRepo': jsv.bool,
        'username': jsv.asciinestring
    });

    const expected = [
        'src/index.js',
        'test/test.js',
        '.babelrc',
        '.gitignore',
        '.npmignore',
        '.eslintrc.json',
        'package.json',
        'README.md',
        'LICENSE'
    ];

    await jsv.assert(
        jsv.forall(promptsArb, async (prompts) => {
            await runWithPrompts(prompts);
            const babelrc = await loadJsonFile('.babelrc');
            const pkgJson = await loadJsonFile('package.json');

            return allExist(expected) &&
                babelrc.presets.indexOf('es2015-node4') > -1 &&
                babelrc.plugins.indexOf('transform-runtime') > -1 &&
                /eslint/i.test(pkgJson.scripts.lint) &&
                /ava/i.test(pkgJson.scripts.test) &&
                /babel/i.test(pkgJson.scripts.build) &&
                /build/i.test(pkgJson.scripts.prepublish) &&
                /onchange/i.test(pkgJson.scripts.watch) &&
                /watch/i.test(pkgJson.scripts.dev)
            ;
        }),
        { tests: verifyTestCount }
    );
});

test.serial('creates expected files for vanilla Javascript', async t => {
    const promptsArb = jsv.record({
        'name': jsv.asciinestring,
        'description': jsv.nestring,
        'author': jsv.nestring,
        'language': jsv.constant('js'),
        'useTravisCI': jsv.bool,
        'addRepo': jsv.bool,
        'username': jsv.asciinestring
    });

    const expected = [
        'lib/index.js',
        'test/test.js',
        '.gitignore',
        '.npmignore',
        '.eslintrc.json',
        'package.json',
        'README.md',
        'LICENSE'
    ];

    await jsv.assert(
        jsv.forall(promptsArb, async (prompts) => {
            await runWithPrompts(prompts);
            const pkgJson = await loadJsonFile('package.json');

            return allExist(expected) && noneExist(['src']) &&
                /eslint/i.test(pkgJson.scripts.lint) &&
                /ava/i.test(pkgJson.scripts.test) &&
                !/build/i.test(pkgJson.scripts.prepublish) &&
                pkgJson.scripts.build == null &&
                pkgJson.scripts.watch == null &&
                pkgJson.scripts.dev == null
            ;
        }),
        { tests: verifyTestCount }
    );
});
