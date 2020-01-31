'use strict';

const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { getCollection } = require('../db/mongoose.db');

const updateDocument = async (req, res, next) => {
	try {
		const { _id } = req.params;
		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndUpdate({ _id }, req.body, { new: true, upsert: true });

		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	updateDocument
};
