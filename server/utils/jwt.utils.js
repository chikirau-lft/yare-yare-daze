'use strict';

const jwt = require('jsonwebtoken');

const generateJWT = (payload, expiresIn) => {
	return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn }
    ).toString(); // TODO: check in env variable is set
};

const verifyJWT = jwt => {
    return jwt.verify(jwt, process.env.JWT_SECRET);
};

module.exports = {
    generateJWT,
    verifyJWT
};
