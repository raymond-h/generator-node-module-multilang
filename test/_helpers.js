// ES5, because AVA won't compile import'd files with Babel,
// and 'babel-register' didn't actually compile anything either

var pathExists = require('path-exists');
var _ = require('lodash');

exports.allExist = function allExist(paths) {
    return _.every(paths, function(path) {
        return pathExists.sync(path);
    });
}

exports.noneExist = function noneExist(paths) {
	return _.every(paths, function(path) {
        return !pathExists.sync(path);
    });
}
