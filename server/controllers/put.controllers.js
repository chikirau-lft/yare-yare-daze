'use strict';

const express = require('express');
const { ObjectID } = require('mongodb');

const { CommonSchema } = require('../models/common');
const { getCollection } = require('../db/mongoose.db');
const { authHandler } = require('../middlewares/auth.middlewares');

const router = express.Router();
router.put(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, async (req, res, next) => {
	try {
		const _id = req.body._id ? req.body._id : new ObjectID(); 

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndUpdate({ _id }, 
			{ ...req.body } , { upsert: true, useFindAndModify: false, new: true });

		if (!document) {
			return next();
		}

		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
