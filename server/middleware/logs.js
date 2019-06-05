'use strict';

const moment = require('moment');
const util = require('util');
const fs = require('fs');

const appendFile = util.promisify(fs.appendFile);

const logger = async(req, res, next) => {
	const time = moment().format('MMMM Do YYYY, h:mm:ss a');
	const start = moment();
    
	res.once('finish', async () => {
		const message = `${req.protocol.toUpperCase()} ${req.method} ${req.originalUrl} ${moment() - start} milliseconds ${req.ip} ${time}\n`;
		await appendFile('logs.txt', message);
	});
	next();
};

module.exports = {
	logger
};