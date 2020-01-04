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
	streams: [{
		level: 'info',
		stream: process.stdout
	}, {
		level: 'error',
		stream: process.stdout
		// path: '/var/tmp/myapp-error.log'
	}],
	serializers: {
		req: reqSerializer
	}
});

module.exports = {
	log
};
