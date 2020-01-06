'use strict';

const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { clientErrors, notFoundError } = require('../constants/errors.constants');
const { getCollection } = require('../db/mongoose.db');
const { parseFilter } = require('../utils/parsers.utils');
const { bulk_response } = require('../constants/mongoose.constants');

const update_document = async (req, res, next) => {
	try {
		const { _id } = req.params;
		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndUpdate({ _id }, req.body , { new: true });

		if (!document) {
			return next(notFoundError());
		}

		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
};

const update_documents = async (req, res, next) => {
	try {
		if (!req.query.filter) {
			throw new Error(clientErrors.NO_FILTER);
		}
		const filter = parseFilter(req.query.filter);

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const documents = await collection.updateMany(filter, req.body);

		const response = { ...bulk_response };
		response.modified = documents.nModified,
		response.matched = documents.nModified === 0 ? documents.n : 0;

		return res.status(200).send(response);
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	update_document,
	update_documents
};
