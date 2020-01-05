'use strict';

const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { CommonSchema } = require('../models/common.models');
const { UserSchema } = require('../models/users.models');
const { getCollection } = require('../db/mongoose.db');
const { bulk_counter_max, bulk_response } = require('../constants/mongoose.constants');

const add_user = async (req, res, next) => {
	try {
		const User = await getCollection(req.params.database, 'Users', UserSchema);
		const body = _.pick(req.body, ['email', 'username', 'password']);
		const user = new User(body);
        
		await user.save();
		return res
			.header('x-auth', await user.generateAuthToken())
			.status(200)
			.send(user);
	} catch (err) {
		return next(err);
	}
};

const authenticate_user = async (req, res, next) => {
	try {
		const User = await getCollection(req.params.database, 'Users', UserSchema);  
		const body = _.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
    
		return res
			.header('x-auth', token)
			.status(200)
			.send(user);
	} catch (err) {
		return next(err);
	}
};

const add_documents = async (req, res, next) => {
	try {
		const collection = await getCollection(req.params.database, req.params.collection, CommonSchema);

		let bulk = collection.collection.initializeOrderedBulkOp();
		let counter = 0;

		req.body.forEach(doc => {
			const { _id } = doc;
			const data = _.omit(doc, ['_id']);

			if (_id) {
				bulk.find({ _id: new ObjectID(_id) }).replaceOne(data);
			} else {
				bulk.insert(data);
			}

			counter++;
			if (counter % bulk_counter_max === 0) {
				bulk.execute((err, r) => {
					if (err) {
						throw new Error(err);
					}
      
					bulk = collection.collection.initializeOrderedBulkOp();
					counter = 0;
				});
			}
		});
    
		bulk.execute((err, result) => {
			if (err) {
				throw new Error(err);
			}

			const response = bulk_response;
			response.inserted = result.nInserted;
			response.matched = result.nMatched;
			response.modified = result.nModified;
			response.deleted = result.nRemoved;

			return res.status(200).send(response);
		});
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	add_user,
	authenticate_user,
	add_documents
};
