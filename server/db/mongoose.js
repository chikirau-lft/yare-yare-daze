'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.pluralize(null);
mongoose.set('useCreateIndex', true);

const connections = {};
  
const getDatabaseConnection = dbName => {
	if (connections[dbName]) {
		return connections[dbName];
	} 
	connections[dbName] = mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`, { useNewUrlParser: true });
	return connections[dbName];      
};

const getCollection = (dbName, colName, schema) => {
	const db = getDatabaseConnection(dbName);
	return db.model(colName, schema);
};

module.exports = {
	getDatabaseConnection,
	getCollection
};
