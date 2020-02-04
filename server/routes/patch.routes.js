'use strict';  

const express = require('express');

const { accessHandler } = require('../middlewares/auth.middlewares');
const { updateDocument, updateDocuments } = require('../controllers/patch.controllers');

const router = express.Router();

router.patch(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, accessHandler, updateDocument);
router.patch(`/${process.env.APP_PREFIX}/:database/:collection`, accessHandler, updateDocuments);

module.exports = router;
