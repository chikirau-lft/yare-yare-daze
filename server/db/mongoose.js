'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const connections = {};
  
const getDatabaseConnection = dbName => {
    if (connections[dbName]) {
        return connections[dbName];
    } else {
        connections[dbName] = mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`, { useNewUrlParser: true });
        return connections[dbName];
    }       
};

module.exports = {
    getDatabaseConnection
};