'use strict';

const errorResponse = (res, status, message) => {
	return res.status(status).send({
		statusCode: status,
		ERROR: message
	});
};

module.exports = {
	errorResponse
}; 
