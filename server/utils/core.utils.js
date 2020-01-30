'use strict';

const vm = require('vm');

const _ = require('lodash');

const arrayToObject = array => {
	return array
		.map(element => JSON.parse(element))
		.reduce((obj, item) => ({ ...obj, ...item }));
};

const stringToObject = str => {
	if (str || typeof str === 'string') {
		const sandbox = { obj: {} };
		vm.createContext(sandbox);
		vm.runInContext(`obj = ${str.split('}{').join('},{')}`, sandbox);
		
		return sandbox.obj;
	}
	return {};
};

const curry = fn => {
	return function f1 (...args) {
		if (args.length >= fn.length) {
			return fn.bind(null, ...args);
		}
		return function f2 (...moreArgs) {
			const newArgs = args.concat(moreArgs);
			return f1.bind(null, ...newArgs);
		};
	};
};

const find = (array, element) => {
	return _.find(array, e => e === element);
};

const map = fn => {
	return array => { 
		return array.map(fn);
	};
};

module.exports = {
	arrayToObject,
	stringToObject,
	curry,
	find,
	map
};
