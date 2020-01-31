'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const {
	getApp,
	getUser,
	getDocument,
	getDocuments
} = require('../controllers/get.controllers');

const router = express.Router();

router.get(`/${process.env.APP_PREFIX}`, getApp);
router.get(`/${process.env.APP_PREFIX}/:database/users/me`, authHandler, getUser);
router.get(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, getDocument);
router.get(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, getDocuments);

module.exports = router;
