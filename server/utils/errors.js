'use strict';

const ClientErrors = Object.freeze({
	INVALID_ID: 'Provided _id is not valid ObjectID field'
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
