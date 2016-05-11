import test from 'ava';

test('can be imported without blowing up', t => {
    var app = require('../app');
    t.truthy(app !== undefined);
});
