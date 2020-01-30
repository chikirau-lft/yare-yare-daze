'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const {
	get_app,
	get_user,
	get_document,
	get_documents
} = require('../controllers/get.controllers');

const router = express.Router();

router.get(`/${process.env.APP_PREFIX}`, get_app);
router.get(`/${process.env.APP_PREFIX}/:database/users/me`, authHandler, get_user);
router.get(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, get_document);
router.get(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, get_documents);

module.exports = router;
