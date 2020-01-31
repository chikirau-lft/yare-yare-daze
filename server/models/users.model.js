'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { clientErrors } = require('../constants/errors.constants');

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
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	const user = this;
	const userData = user.toObject();

	return _.pick(userData, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () {
	const user = this;
	const access = 'auth';
	const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

	user.tokens.push({ access, token });
	await user.save();

	return token;
};

UserSchema.methods.removeToken = function (token) {
	const user = this;

	return user.updateOne({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

UserSchema.statics.findByToken = function (token) {
	const user = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject(clientErrors.INVALID_JWT);
	}

	return user.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
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
