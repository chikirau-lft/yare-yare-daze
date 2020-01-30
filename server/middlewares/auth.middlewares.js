'use strict';

const { UserSchema } = require('../models/users.model');
const { getCollection } = require('../db/mongoose.db');
const { errorResponse } = require('../utils/http.utils');
const { defaultHandler } = require('./core.middlewares');

const jwtHandler = async (req, res, next) => {
	try {
		const User = await getCollection(req.params.database, 'Users', UserSchema);

		const token = req.header('x-auth');
		const user = await User.findByToken(token);
		if (!user) {
			return errorResponse(res, 401, 'Unauthorized');     
		}        
		req.user = user;
		req.token = token;
		return next();
	} catch (e) {
		return errorResponse(res, 401, 'Unauthorized'); 
	}
};

const authHandler = process.env.JWT_AUTH === 'true' ? jwtHandler : defaultHandler;

module.exports = { 
	jwtHandler,
	authHandler
};
