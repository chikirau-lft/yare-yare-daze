'use strict';

const { UserSchema } = require('../models/users.model');
const { getCollection } = require('../db/mongoose.db');
const { unAuthorizedError } = require('../constants/errors.constants');
const { defaultHandler } = require('./core.middlewares');
const { clientErrors } = require('../constants/errors.constants');

const jwtHandler = async (req, res, next) => {
	try {
		const Users = await getCollection(req.params.database, 'Users', UserSchema);
		const accessToken = req.header('x-auth');
		const user = await Users.findByToken(accessToken, 'tokens.accessToken');
		if (!user) {
			throw unAuthorizedError();     
		}

		console.log(user, accessToken)

		if (user.error) {
			throw new Error(clientErrors.TOKEN_EXPIRED);
		}

		req.user = user;
		req.accessToken = accessToken;
		
		return next();
	} catch (err) {
		return next(err);
	}
};

const authHandler = process.env.JWT_AUTH === 'true' ? jwtHandler : defaultHandler;

module.exports = { 
	jwtHandler,
	authHandler
};
