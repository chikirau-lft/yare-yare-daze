'use strict';

const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { clientErrors, notFoundError } = require('../constants/errors.constants');
const { getCollection } = require('../db/mongoose.db');
const { parseFilter } = require('../utils/parsers.utils.js');
const { bulk_response } = require('../constants/mongoose.constants');

const delete_token = async (req, res, next) => {
	try {
		await req.user.removeToken(req.token);
		return res.status(200).send();
	} catch (err) {
		return next(err);
	}
};

const delete_document = async (req, res, next) => {
	try {
		const { _id } = req.params;
		if (!ObjectId.isValid(_id)) {
			throw new Error(clientErrors.INVALID_ID);
		}

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const document = await collection.findOneAndRemove({ _id });

		if (!document) {
			return next(notFoundError());
		}
 
		return res.status(200).send(document);
	} catch (err) {
		return next(err);
	}
};

const delete_documents = async (req, res, next) => {
	try {
		const filter = parseFilter(req.query.filter);

		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);
		const documents = await collection.deleteMany(filter);

		const response = bulk_response;
		response.deleted =  documents.n;

		return res.status(200).send(response);
	} catch (err) {
		return next(err);
	}
};


module.exports = {
	delete_token,
	delete_document,
	delete_documents
};
