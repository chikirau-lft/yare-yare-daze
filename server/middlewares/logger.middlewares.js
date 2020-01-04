'use strict';

const moment = require('moment');

const { log } = require('../utils/logger.utils');

const logger = (req, res, next) => {
	res.once('finish', async () => {
		log.info({
			req
		});
	});
	next();
};

module.exports = {
	logger
};
