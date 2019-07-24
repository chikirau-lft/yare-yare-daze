'use strict';

const { JWTauthenticate } = require('../middleware/authenticate.js');

const middleware = async (req, res, next) => next();
const authHandler = process.env.JWT_AUTH === 'true' ? JWTauthenticate : (req, res, next) => next();

module.exports = {
	middleware,
	authHandler
};
