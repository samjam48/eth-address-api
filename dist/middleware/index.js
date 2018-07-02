'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var routes = (0, _express.Router)();

	console.log('middleware config =', config);
	console.log('middleware db =', db);

	// add middleware here

	return routes;
};
//# sourceMappingURL=index.js.map