'use strict';

const mongoose = require('mongoose');
const express = require('express');
const { ObjectID } = require('mongodb');

const router = express.Router();

const { CommonSchema } = require('../models/common.js');

router.post(`/mongo/${process.env.MONGO_DATABASE}/:collection`, async(req, res) => {
    try {
        const updateDocs = req.body.filter(doc => doc._id !== undefined);
        const insertDocs = req.body.filter(doc => doc._id === undefined);

        const collection = mongoose.model(req.params.collection, CommonSchema);
        const insertedDocs = await collection.insertMany(insertDocs);

        let bulk = collection.collection.initializeOrderedBulkOp();
        let counter = 0;

        let response = {
            _embedded: [],
            inserted: insertDocs.length,
            deleted: 0,
            modified: 0,
            matched: 0
        };

        for(const doc of insertedDocs) {
            response._embedded.push({
                href: `/mongo/${process.env.MONGO_DATABASE}/${req.params.collection}/${doc._id}`
            });
        }

        updateDocs
            .map(doc => doc._id)
            .forEach((id, index) => {
                let { _id, ...data } = updateDocs[index];
                bulk.find({ _id: new ObjectID(id) }).update({ $set: data }, { new: true, useFindAndModify: false });
                response._embedded.push({
                    href: `/mongo/${process.env.MONGO_DATABASE}/${req.params.collection}/${id}`
                });
    
                counter++;
                if (counter % 500 == 0) {
                    bulk.execute((err, r) => {             
                        bulk = collection.collection.initializeOrderedBulkOp();
                        counter = 0;
                    });
                }
            });
    
        if (counter > 0) {
            bulk.execute((err, result) => {
                response.matched = result.nMatched;
                response.modified = result.nModified;
                response.deleted = result.nRemoved;
                return res.status(200).send(response);
            });
        } else {
            return res.status(200).send(response);
        }
    } catch(e) {
        return res.status(400).send({
            statusCode: 400,
            ERROR: e.message
        });   
    }
});

module.exports = router;