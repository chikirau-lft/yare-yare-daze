'use strict';

const bunyan = require('bunyan');

const reqSerializer = req => {
	return {
		method: req.method,
		url: req.url,
		headers: req.headers
	};
};

const log = bunyan.createLogger({ 
	name: 'logger_v1',
	/* streams: [{
		level: 'info',
		path: `./log/${process.env.APP_PREFIX}-req.log`
	}, {
		level: 'error',
		path: `./log/${process.env.APP_PREFIX}-error.log`
	}], */
	serializers: {
		req: reqSerializer
	}
});

module.exports = {
	log
};
