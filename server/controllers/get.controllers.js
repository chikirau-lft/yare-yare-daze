'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.js');
const { clientErrors } = require('../utils/errors.js');
const { generateProperties } = require('../utils/property.js');
const { getCollection } = require('../db/mongoose.js');
const { authHandler } = require('../middlewares/auth.middlewares');
const {
	parseFilter,
	parseSort,
	parsePagesize,
	parsePage,
	parseCount,
	parseKeys,
	parseHint
} = require('../utils/parsers.js');

const router = express.Router();
router.get(`/${process.env.APP_PREFIX}`, (req, res) => {
	return res.status(200).send({
		statusCode: 200,
		applicationName: process.env.APP_PREFIX
	});
});

router.get(`/${process.env.APP_PREFIX}/:database/users/me`, authHandler, (req, res) => {
	res.send(req.user);
});

router.get(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, async (req, res, next) => {
	try {
		const { _id } = req.params;

		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOne({ _id });

		if (!document) {
			return next(new Error('Not Found'));
		}

		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
});

router.get(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, async (req, res, next) => {
	try {
		const filter = parseFilter(req.query.filter);
		const sort = parseSort(req.query.sort);
		const pagesize = parsePagesize(req.query.pagesize);
		const page = parsePage(req.query.page);
		const count = parseCount(req.query.count);
		const keys = parseKeys(req.query.keys);
		const hint = parseHint(req.query.hint);

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
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
});

module.exports = router;
