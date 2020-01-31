'use strict';

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { updateDocument } = require('../controllers/put.controllers');

const router = express.Router();

router.put(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, updateDocument);

module.exports = router;
