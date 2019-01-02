'use strict';

const mongoose = require('mongoose');
const express = require('express');
const { ObjectID } = require('mongodb');

const router = express.Router();

const { CommonSchema } = require('../models/common.js');
const { ClientErrors } = require('../utils/errors.js');

router.put(`/mongo/${process.env.MONGO_DATABASE}/:collection`, async(req, res) => {
    try {
        const _id = req.body._id ? req.body._id : new ObjectID(); 

        const collection = mongoose.model(req.params.collection, CommonSchema);
        const document = await collection.findOneAndUpdate({ _id }, 
            {...req.body} , { upsert: true, useFindAndModify: false, new: true });

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

module.exports = router;