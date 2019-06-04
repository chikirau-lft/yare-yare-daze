'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { ObjectId } = require('mongodb');

const { CommonSchema } = require('../models/common.js');
const { ClientErrors } = require('../utils/errors.js');
const { generateProperties } = require('../utils/property.js');
const { getDatabaseConnection } = require('../db/mongoose.js');
const { authenticate } = require('../middleware/authenticate.js');
const {
    parseFilter,
    parseSort,
    parsePagesize,
    parsePage,
    parseCount,
    parseKeys,
    parseHint
} = require('../utils/parsers.js');

const router = express.Router();
router.get(`/${process.env.APP_PREFIX}`, (req, res) => {
    return res.status(200).send({
        statusCode: 200,
        applicationName: 'iisREST'
    });
});

router.get(`/${process.env.APP_PREFIX}/:database/:collection/:_id`, async(req, res, next) => {
    if (!req.params._id)
        return next('route');

    try {
        const _id = req.params._id;

        if (!ObjectId.isValid(_id))
            throw new Error(ClientErrors.INVALID_ID);

        const db = getDatabaseConnection(req.params.database);
        const collection = db.model(req.params.collection, CommonSchema);
        const document = await collection.findOne({ _id });

        if (!document)
            return res.status(404).send();

        return res.status(200).send(document);
    } catch(e) {
        return res.status(400).send({
            statusCode: 400,
            ERROR: e.message
        });
    }
});

router.get(`/${process.env.APP_PREFIX}/:database/:collection`, authenticate, async(req, res) => {
    try {
        const filter   = parseFilter(req.query.filter);
        const sort     = parseSort(req.query.sort);
        const pagesize = parsePagesize(req.query.pagesize);
        const page     = parsePage(req.query.page);
        const count    = parseCount(req.query.count);
        const keys     = parseKeys(req.query.keys);
        const hint     = parseHint(req.query.hint);

        const db = getDatabaseConnection(req.params.database);
        const collection = db.model(req.params.collection, CommonSchema);
        const documents = await collection.find(filter === '' ? {} : filter)
            .select(keys)
            .hint(hint)
            .skip(isNaN(page) ? +process.env.DEFAULT_PAGENUM : page * pagesize - pagesize)
            .limit(isNaN(pagesize) ? +process.env.DEFAULT_PAGESIZE : pagesize)
            .sort(sort);

        const response = req.query.np === '' ? documents 
            : generateProperties(documents, req.params.collection, await collection.countDocuments({}), pagesize, count);

        return res.send(response);
    } catch(e) {
        return res.status(400).send({
            statusCode: 400,
            ERROR: e.message
        });
    }
});

module.exports = router;
