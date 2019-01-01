'use strict';  

const mongoose = require('mongoose');
const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { CommonSchema } = require('../models/common.js');

router.patch(`/mongo/${process.env.MONGO_DATABASE}/:collection/:_id`, async(req, res) => {
    try {
        const _id = req.params._id;
        const update = req.body;

        if (!ObjectId.isValid(_id))
            throw new Error('Invalid _id field');

        const collection = mongoose.model(req.params.collection, CommonSchema);
        const document = await collection.findOneAndUpdate({ _id }, {...req.body} , { new: true, useFindAndModify: false });

        if(!document)
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
