'use strict';

const { ClientErrors } = require('./http.utils.js');
const { arrayToObject, stringToObject } = require('./core.utils.js');

const parseFilter = filter => {
	return stringToObject(filter !== undefined ? filter : process.env.DEFAULT_FILTER);
};

const parseSort = sort => {
	return sort !== undefined ? stringToObject(sort) : process.env.DEFAULT_SORT;
};

const parsePagesize = pagesize => {
	if (pagesize === undefined || Number(pagesize) > Number(process.env.MAX_PAGESIZE)) {
		return Number(process.env.DEFAULT_PAGESIZE);
	} else if (Number(pagesize) <= 0 || isNaN(Number(pagesize))) {
		throw new Error(ClientErrors.INVALID_PAGESIZE);
	}

	return Number(pagesize);
};

const parsePage = page => {
	if (page === undefined) {
		return Number(process.env.DEFAULT_PAGENUM);
	} else if (Number(page) <= 0 || isNaN(Number(page))) {
		throw new Error(ClientErrors.INVALID_PAGE);
	}

	return Number(page); 
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
