'use strict';

const express = require('express');

const { accessHandler } = require('../middlewares/auth.middlewares');
const {
	getApp,
	getUser,
	getDocument,
	getDocuments
} = require('../controllers/get.controllers');

const router = express.Router();

router.get(`/${process.env.APP_PREFIX}`, getApp);
router.get(`/${process.env.APP_PREFIX}/:database/users/me`, accessHandler, getUser);
router.get(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, accessHandler, getDocument);
router.get(`/${process.env.APP_PREFIX}/:database/:collection`, accessHandler, getDocuments);

module.exports = router;
