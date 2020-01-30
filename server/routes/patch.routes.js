'use strict';  

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { update_document, update_documents } = require('../controllers/patch.controllers');

const router = express.Router();

router.patch(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, update_document);
router.patch(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, update_documents);

module.exports = router;
