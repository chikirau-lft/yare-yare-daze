'use strict';

const _ = require('lodash');
const { arrayToObject } = require('./utils.js');

const parseFilter = filterParam => {
	if (filterParam === undefined) {
		return process.env.DEFAULT_FILTER;
	}
	const filter = _.replace(filterParam, new RegExp(',','g'), '');

	const start = filter.indexOf('['), 
		end = filter.indexOf(']');

	if (start !== -1 && end !== -1) {
		const arr = filter.substring(start + 1, end - 1);
		const res = arr.split('}').map(s => s + '}');
        
		if (res[0] === '[}') {
			return JSON.parse(_.replace(filter, new RegExp('\'','g'), '"'));
		}
        
		const jsonString = filter.substring(0, start) + '[' + res.join(',') + ']}';
		const json = _.replace(jsonString, new RegExp('\'','g'), '"');
		return JSON.parse(json);
	}
	return JSON.parse(_.replace(filter, new RegExp('\'','g'), '"'));
};

const parseSort = sort => {
	return sort !== undefined 
		? JSON.parse(_.replace(sort, new RegExp('\'','g'), '"')) : process.env.DEFAULT_SORT;
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
	return typeof keys === 'object' 
		? arrayToObject(keys) : keys !== undefined ? JSON.parse(_.replace(keys, new RegExp('\'','g'), '"')) : process.env.DEFAULT_KEYS;
};

const parseHint = hint => {
	return typeof hint === 'object' 
		? hint.join(' ') : hint !== undefined ? JSON.parse(_.replace(hint, new RegExp('\'','g'), '"')) : process.env.DEFAULT_HINT;
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
