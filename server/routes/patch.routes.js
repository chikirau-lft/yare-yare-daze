'use strict';  

const express = require('express');

const { authHandler } = require('../middlewares/auth.middlewares');
const { updateDocument, updateDocuments } = require('../controllers/patch.controllers');

const router = express.Router();

router.patch(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, authHandler, updateDocument);
router.patch(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, updateDocuments);

module.exports = router;
