'use strict';

const mongoose = require('mongoose');

const { internalError } = require('../constants/errors.constants');

mongoose.Promise = global.Promise;
mongoose.pluralize(null);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

const connections = {};

const getDatabaseConnection = async dbName => {
	if (connections[dbName]) {
		return connections[dbName];
	}
	connections[dbName] = await mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`);

	return connections[dbName];
};

const getCollection = async (dbName, colName, schema) => {
	try {
		const db = await getDatabaseConnection(dbName);
		return db.model(colName, schema);
	} catch (err) {
		throw internalError();
	}
};

module.exports = {
	getDatabaseConnection,
	getCollection
};
