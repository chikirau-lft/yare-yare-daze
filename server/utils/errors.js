'use strict';

const ClientErrors = Object.freeze({
	INVALID_ID: 'Provided _id is not valid ObjectID field',
	INVALID_CREDENTIALS: 'Provided credentials are not valid'
});

const errorResponse = (res, status, message) => {
	return res.status(status).send({
		statusCode: status,
		ERROR: message
	});
};

module.exports = {
	ClientErrors,
	errorResponse
}; 
