'use strict';

const express = require('express');

const { accessHandler } = require('../middlewares/auth.middlewares');
const { 
	deleteToken,
	deleteDocument,
	deleteDocuments 
} = require('../controllers/delete.controllers');

const router = express.Router();

router.delete(`/${process.env.APP_PREFIX}/:database/users/logout`, accessHandler, deleteToken);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, accessHandler, deleteDocument);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection`, accessHandler, deleteDocuments);

module.exports = router;
