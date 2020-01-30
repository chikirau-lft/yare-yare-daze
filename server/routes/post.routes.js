'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const {
	add_user,
	authenticate_user,
	add_documents
} = require('../controllers/post.controllers');

const router = express.Router();

router.post(`/${process.env.APP_PREFIX}/:database/users`, add_user);
router.post(`/${process.env.APP_PREFIX}/:database/users/login`, authenticate_user);
router.post(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, add_documents);

module.exports = router;
