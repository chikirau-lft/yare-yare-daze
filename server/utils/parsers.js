'use strict';

const { ClientErrors } = require('./errors.js');
const { arrayToObject, stringToObject } = require('./utils.js');

const parseFilter = filter => {
	return stringToObject(filter !== undefined ? filter : process.env.DEFAULT_FILTER);
};

const parseSort = sort => {
	return sort !== undefined ? stringToObject(sort) : process.env.DEFAULT_SORT;
};

const parsePagesize = pagesize => {
	if (Number(pagesize) <= 0) {
		throw new Error(ClientErrors.INVALID_PAGESIZE);
	}
	return pagesize === undefined || Number(pagesize) > Number(process.env.MAX_PAGESIZE)
		? Number(process.env.DEFAULT_PAGESIZE) : Number(pagesize);
};

const parsePage = page => {
	return page !== undefined ? Number(page) : Number(process.env.DEFAULT_PAGENUM); 
};

const parseCount = count => {
	return count === 'true';
};

const parseKeys = keys => {
	return typeof keys === 'object' ? arrayToObject(keys) : keys !== undefined ? stringToObject(keys) : process.env.DEFAULT_KEYS;
};

const parseHint = hint => {
	return typeof hint === 'object' ? hint.join(' ') : hint !== undefined ? stringToObject(hint) : process.env.DEFAULT_HINT;
};

module.exports = {
	parseFilter,
	parseSort,
	parsePagesize,
	parsePage,
	parseCount,
	parseKeys,
	parseHint
};
