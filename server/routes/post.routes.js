'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const {
	addUser,
	authenticateUser,
	addDocuments,
	refreshTokens
} = require('../controllers/post.controllers');

const router = express.Router();

router.post(`/${process.env.APP_PREFIX}/:database/users`, addUser);
router.post(`/${process.env.APP_PREFIX}/:database/users/refresh-token`, refreshTokens);
router.post(`/${process.env.APP_PREFIX}/:database/users/login`, authenticateUser);
router.post(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, addDocuments);

module.exports = router;
