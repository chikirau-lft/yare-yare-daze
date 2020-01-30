'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { 
	delete_token,
	delete_document,
	delete_documents 
} = require('../controllers/delete.controllers');

const router = express.Router();

router.delete(`/${process.env.APP_PREFIX}/:database/users/token`, authHandler, delete_token);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, delete_document);
router.delete(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, delete_documents);

module.exports = router;
