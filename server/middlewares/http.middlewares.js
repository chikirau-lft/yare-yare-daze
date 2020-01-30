'use strict';

const { httpMethods } = require('../constants/http.constants');
const { errorResponse } = require('../utils/http.utils');
const { notFoundError, notAllowedError } = require('../constants/errors.constants');

const methodsHandler = (req, res, next) => {
	const allowedMethods = httpMethods();
	if (!allowedMethods.includes(req.method)) {
		return next(notAllowedError());
	}

	return next();
};

const notFoundHandler = (req, res, next) => {
	return next(notFoundError());
};

const clientErrorHandler = (err, req, res, next) => {
	return errorResponse(
		res, 
		err.status || 400, 
		err.message || err.message
	);
};

module.exports = {
	methodsHandler,
	notFoundHandler,
	clientErrorHandler
};
