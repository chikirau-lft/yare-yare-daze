'use strict';

const express = require('express');
const { ObjectID } = require('mongodb');

const { CommonSchema } = require('../models/common.js');
const { getCollection } = require('../db/mongoose.js');
const { errorResponse } = require('./../utils/errors.js');
const { authHandler } = require('../middleware/authenticate.js');

const router = express.Router();
router.put(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, async (req, res) => {
	try {
		const _id = req.body._id ? req.body._id : new ObjectID(); 

		const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndUpdate({ _id }, 
			{ ...req.body } , { upsert: true, useFindAndModify: false, new: true });

		if (!document) {
			return errorResponse(res, 404, 'Not Found');
		}

		return res.status(200).send(document);
	} catch (e) {
		return errorResponse(res, 400, e.message); 
	}
});

module.exports = router;
