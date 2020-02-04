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

UserSchema.methods.generateTokens = async function (createdAt, updatedAt) {
	const user = this;
	const payload = {
		_id: user._id.toHexString() 
	};
	const accessToken = generateJWT(payload, Number(process.env.JWT_ACCESS_LIFETIME));
	const refreshToken = generateJWT(payload, Number(process.env.JWT_REFRESH_LIFETIME));
	user.tokens.push({ 
		accessToken,
		refreshToken,
		createdAt,
		updatedAt
	});

	await user.save();

	return {
		accessToken,
		refreshToken
	};
};

UserSchema.methods.removeToken = function (token, type) {
	const user = this;

	return user.updateOne({
		$pull: {
			tokens: {
				[type]: token
			}
		}
	});
};

UserSchema.statics.findByToken = function (token, type) {
	const users = this;

	return users.findOne({ 
		[type]: token 
	}).then(user => {
		if (!user) {
			return Promise.reject(new Error(clientErrors.INVALID_SESSION));
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return Promise.resolve({
				user,
				error: clientErrors.TOKEN_EXPIRED
			});
		}

		return Promise.resolve(user);
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	const user = this;

	return user.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject(new Error(clientErrors.INVALID_CREDENTIALS));
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (err || !res) { 
					reject(new Error(clientErrors.INVALID_CREDENTIALS));
				}
				resolve(user);
			});
		});
	});
};

UserSchema.pre('save', function (next) {
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
});

module.exports = {
	UserSchema
};
