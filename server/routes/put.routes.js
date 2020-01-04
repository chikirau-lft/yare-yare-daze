'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { update_documents } = require('../controllers/put.controllers');

const router = express.Router();

router.put(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, update_documents);

module.exports = router;
