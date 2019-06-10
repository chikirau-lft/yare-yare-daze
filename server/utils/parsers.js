'use strict';

const { arrayToObject, stringToObject } = require('./utils.js');

const parseFilter = filter => {
	if (filter === undefined) {
		return process.env.DEFAULT_FILTER;
	}

	const start = filter.indexOf('['); 
	const end = filter.indexOf(']');

	if (start !== -1 && end !== -1) {
		const arr = filter
			.substring(start + 1, end)
			.split('}')
			.filter(s => s !== '')
			.map(s => `${s}}`.replace(/^,|,$/g,'').trim());
		
		return stringToObject(`${filter.substring(0, start)}[${arr.join(',')}]}`);
	}
	return stringToObject(filter);
};

const parseSort = sort => {
	return sort !== undefined ? stringToObject(sort) : process.env.DEFAULT_SORT;
};

const parsePagesize = pagesize => {
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
