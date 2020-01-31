'use strict';

const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { generateProperties } = require('../utils/response.utils');
const { getCollection } = require('../db/mongoose.db');
const { clientErrors, notFoundError } = require('../constants/errors.constants');
const {
	parseFilter,
	parseSort,
	parsePagesize,
	parsePage,
	parseCount,
	parseKeys,
	parseHint
} = require('../utils/parsers.utils.js');

const getApp = (req, res) => {
	return res.status(200).send({
		statusCode: 200,
		applicationName: process.env.APP_PREFIX
	});
};

const getUser = (req, res) => {
	res.send(req.user);
};

const getDocument = async (req, res, next) => {
	try {
		const { _id } = req.params;
		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOne({ _id });

		if (!document) {
			return next(notFoundError());
		}

		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
};

const getDocuments = async (req, res, next) => {
	try {
		const filter = parseFilter(req.query.filter);
		const sort = parseSort(req.query.sort);
		const pagesize = parsePagesize(req.query.pagesize);
		const page = parsePage(req.query.page);
		const count = parseCount(req.query.count);
		const keys = parseKeys(req.query.keys);
		const hint = parseHint(req.query.hint);

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const documents = await collection.find(filter)
			.skip(page * pagesize - pagesize)
			.select(keys)
			.hint(hint)
			.sort(sort)
			.limit(pagesize);

		const response = req.query.np === '' ? documents 
			: generateProperties(
				documents, 
				req.params.collection, 
				await collection.countDocuments({}), 
				pagesize, 
				count
			);

		return res.send(response);
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	getApp,
	getUser,
	getDocument,
	getDocuments
};
