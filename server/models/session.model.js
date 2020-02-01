'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { clientErrors } = require('../constants/errors.constants');
const { verifyJWT } =require('../utils/jwt.utils');

const { Schema } = mongoose;

const SessionSchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		required: true,
		trim: true
	},
	refreshToken: { // TODO: check if unique
		type: String,
		required: true,
		trim: true
	},
	createdAt: {
		type: Number,
		required: true,
	},
	updatedAt: {
		type: Number,
		required: true,
	}
});

SessionSchema.statics.findByRefreshToken = function (refreshToken) {
	const session = this;

	return session.findOne({ refreshToken }).then(session => {
		if (!session) {
			return Promise.reject(clientErrors.INVALID_SESSION);
		}

		try {
			jwt.verify(refreshToken, process.env.JWT_SECRET);
		} catch (err) {
			return Promise.reject(new Error(clientErrors.TOKEN_EXPIRED));
		}

		return Promise.resolve(session);
	});
};

module.exports = {
	SessionSchema
};
