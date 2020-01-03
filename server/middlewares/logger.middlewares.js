'use strict';

const moment = require('moment');

const { log } = require('./utils/logger.utils');

const logger = (req, res, next) => {
	// const time = moment().format('MMMM Do YYYY, h:mm:ss a');
	// const start = moment();
    
	res.once('finish', async () => {
		log.info({
			req: req
		});
		// const requestTime = moment() - start;
		// const protocol = req.protocol.toUpperCase();
		// const { method } = req;
		// const url = req.originalUrl;
		// const { ip } = req;
		// const message = `${protocol} ${method} ${url} ${requestTime} milliseconds ${ip} ${time}\n`;
		// await appendFile('logs.txt', message);
	});
	next();
};

module.exports = {
	logger
};
