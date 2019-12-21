'use strict';  

const express = require('express');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.js');
const { clientErrors, errorResponse } = require('../utils/errors.js');
const { getCollection } = require('../db/mongoose.js');
const { authHandler } = require('../constants/middleware.js');

const router = express.Router();
router.patch(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, async (req, res, next) => {
	if (req.params._id === '*') {
		return next('route');
	}

	try {
		const { _id } = req.params;
		const update = req.body;

		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndUpdate({ _id }, update , { new: true, useFindAndModify: false });

		if (!document) {
			return errorResponse(res, 404, 'Not Found');
		}

		return res.status(200).send(document);
	} catch (e) {
		return errorResponse(res, 400, e.message);
	}
});

// Bulk PATCH
router.patch(`/${process.env.APP_PREFIX}/:database/:collection/*`, authHandler, async (req, res) => {
	try {
		const filter = req.query.filter !== undefined 
			? JSON.parse(_.replace(req.query.filter, new RegExp('\'','g'), '"')) : '';

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
		const documents = await collection.updateMany(filter, req.body, { useFindAndModify: false });

		return res.status(200).send({
			inserted: 0,
			deleted: 0,
			modified: documents.nModified,
			matched: documents.nModified === 0 ? documents.n : 0
		});
	} catch (e) {
		return errorResponse(res, 400, e.message);
	}
});

module.exports = router;
