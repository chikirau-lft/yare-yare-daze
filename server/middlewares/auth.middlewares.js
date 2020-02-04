'use strict';

const { UserSchema } = require('../models/users.model');
const { getCollection } = require('../db/mongoose.db');
const { unAuthorizedError } = require('../constants/errors.constants');
const { defaultHandler } = require('./core.middlewares');
const { clientErrors } = require('../constants/errors.constants');

const jwtAccessHandler = async (req, res, next) => {
	try {
		const Users = await getCollection(req.params.database, 'Users', UserSchema);
		const accessToken = req.header('x-auth');
		const user = await Users.findByToken(accessToken, 'tokens.accessToken');
		
		if (!user) {
			throw unAuthorizedError();     
		}

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

const jwtRefreshHandler = async (req, res, next) => {
	try {
		const Users = await getCollection(req.params.database, 'Users', UserSchema);
		const refreshToken = req.cookies.r_token;
		const user = await Users.findByToken(refreshToken, 'tokens.refreshToken');
		
		if (!user) {
			throw unAuthorizedError();     
		}

		if (user.error) {
			throw new Error(clientErrors.TOKEN_EXPIRED);
		}

		req.user = user;
		req.refreshToken = refreshToken;
		
		return next();
	} catch (err) {
		return next(err);
	}
};

const isAuth = process.env.JWT_AUTH === 'true';
const accessHandler = isAuth ? jwtAccessHandler : defaultHandler;
const refreshHandler = isAuth ? jwtRefreshHandler : defaultHandler;

module.exports = {
	isAuth,
	accessHandler,
	refreshHandler
};
