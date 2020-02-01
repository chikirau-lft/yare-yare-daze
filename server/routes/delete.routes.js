'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { 
	deleteToken,
	deleteDocument,
	deleteDocuments 
} = require('../controllers/delete.controllers');

const router = express.Router();

router.delete(`/${process.env.APP_PREFIX}/:database/users/logout`, authHandler, deleteToken);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, deleteDocument);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, deleteDocuments);

module.exports = router;
