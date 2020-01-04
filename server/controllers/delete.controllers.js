'use strict';

const _ = require('lodash');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { clientErrors, notFoundError } = require('../constants/errors.constants');
const { getCollection } = require('../db/mongoose.db');

const delete_token = async (req, res, next) => {
	try {
		await req.user.removeToken(req.token);
		return res.status(200).send();
	} catch (err) {
		return next(err);
	}
};

const delete_document = async (req, res, next) => {
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
};

const delete_documents = async (req, res, next) => {
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
};


module.exports = {
	delete_token,
	delete_document,
	delete_documents
};
