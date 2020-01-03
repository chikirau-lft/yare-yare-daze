'use strict';

const express = require('express');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { clientErrors, notFoundError } = require('../constants/errors.constants');
const { getCollection } = require('../db/mongoose.db');
const { authHandler } = require('../middlewares/auth.middlewares');

const router = express.Router();
router.delete(`/${process.env.APP_PREFIX}/:database/users/token`, authHandler, async (req, res, next) => {
	try {
		await req.user.removeToken(req.token);
		return res.status(200).send();
	} catch (err) {
		return next(err);
	}
});

router.delete(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, async (req, res, next) => {
	if (req.params._id === '*') {
		return next('route');
	}

	try {
		const { _id } = req.params;

		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndRemove({ _id }, { useFindAndModify: false });

		if (!document) {
			return next(notFoundError());
		}
 
		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
});

// Bulk DELETE
router.delete(`/${process.env.APP_PREFIX}/:database/:collection/*`, authHandler, async (req, res, next) => {
	try {
		const filter = req.query.filter !== undefined 
			? JSON.parse(_.replace(req.query.filter, new RegExp('\'','g'), '"')) : '';

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const documents = await collection.deleteMany(filter);

		return res.status(200).send({
			inserted: 0,
			deleted: documents.n,
			modified: 0,
			matched: 0
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
