'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { clientErrors } = require('../constants/errors.constants');
const { generateJWT } = require('../utils/jwt.utils');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: value => validator.isEmail(value),
			message: '{VALUE} is not valid email address!'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		accessToken: {
			type: String,
			required: true
		},
		refreshToken: {
			type: String,
			required: true
		},
		createdAt: {
			type: Number,
			required: true
		},
		updatedAt: {
			type: Number,
			required: true
		}
	}]
});

/* UserSchema.methods.toJSON = function () {
	const user = this;
	const userData = user.toObject();

	return _.pick(userData, ['_id', 'email']);
}; */

UserSchema.methods.generateTokens = function () {
	// const user = this;
	const payload = {
		// _id: user._id.toHexString() 
	};
	const accessToken = generateJWT(payload, 1000);
	const refreshToken = generateJWT(payload, 6000);

	/* user.tokens.push({ 
		accessToken,
		refreshToken 
	}); */

	return {
		accessToken,
		refreshToken
	};
};

/* UserSchema.methods.removeToken = function (token) {
	const user = this;

	return user.updateOne({
		$pull: {
			tokens: {
				token
			}
		}
	});
}; */

UserSchema.statics.findByRefreshToken = function (refreshToken) {
	/* const user = this;
	let decoded;

	try {
		decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject(new Error(clientErrors.INVALID_JWT));
	}

	return user.findOne({
		// _id: decoded._id,
		'tokens.refreshToken': refreshToken
	}); */
	const users = this;
	return users.findOne({ refreshToken }).then(user => {
		if (!user) {
			return Promise.reject(new Error(clientErrors.INVALID_SESSION));
		}

		try {
			const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
			return Promise.resolve(user);
		} catch (err) {
			// sessions.deleteOne({ refreshToken });
			// return Promise.reject(new Error(clientErrors.TOKEN_EXPIRED));
			return Promise.resolve(null);
		}

		
	});
};

/* UserSchema.statics.findByCredentials = function (email, password) {
	const user = this;

	return user.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject(clientErrors.INVALID_CREDENTIALS);
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (err || !res) { 
					reject(clientErrors.INVALID_CREDENTIALS);
				}
				resolve(user);
			});
		});
	});
}; */

/* UserSchema.pre('save', function (next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				throw new Error(err);
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					throw new Error(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next(); 
	}
}); */

module.exports = {
	UserSchema
};
