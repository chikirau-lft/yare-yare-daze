'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { update_document } = require('../controllers/put.controllers');

const router = express.Router();

router.put(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, update_document);

module.exports = router;
