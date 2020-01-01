'use strict';

const { httpMethods } = require('../constants/http.constants');
const { errorResponse } = require('../utils/errors');
const { notFoundError } = require('../constants/errors.constants');

const methodsHandler = (req, res, next) => {
    const allowedMethods = httpMethods();
    if (!allowedMethods.includes(req.method)) {
        const err = new Error('Method Not Allowed.');
        err.status = 405;
        return next(err);
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
