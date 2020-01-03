'use strict';

const clientErrors = Object.freeze({
	INVALID_ID: 'Provided _id is not valid ObjectID field.',
	INVALID_PAGESIZE: 'Provided pagesize param should be a number gte than 0.',
	INVALID_PAGE: 'Provided page param should be a number gte than 0.',
	INVALID_CREDENTIALS: 'Provided credentials are not valid.',
	INVALID_JWT: 'Provided jwt token is not valid or have already expired.',
	RESOURSE_NOT_FOUND: 'Requested resourse not found.',
	METHOD_NOT_ALLOWED: 'Method Not Allowed.'
});

const serverErrors = Object.freeze({
	INTERNAL_ERROR: 'Internal Server Error.'
});

const error = (status, message) => {
	const err = new Error(message);
	err.status = status;
	return err;
};

const notFoundError = () => error(404, clientErrors.RESOURSE_NOT_FOUND);
const notAllowedError = () => error(405, clientErrors.METHOD_NOT_ALLOWED);
const internalError = () => error(500, serverErrors.INTERNAL_ERROR);

module.exports = {
	clientErrors, 
	serverErrors,
	notFoundError,
	notAllowedError,
	internalError
}; 
