'use strict';

const jwt = require('jsonwebtoken');

const generateJWT = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET).toString(); // TODO: check in env variable is set
};

const verifyJWT = jwt => {
    return jwt.verify(jwt, process.env.JWT_SECRET);
};

module.exports = {
    generateJWT,
    verifyJWT
};
