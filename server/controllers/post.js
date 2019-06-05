'use strict';

const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { CommonSchema } = require('../models/common.js');
const { UserSchema } = require('./../models/users.js');
const { getCollection } = require('../db/mongoose.js');
const { authHandler } = require('../middleware/authenticate.js');

const router = express.Router();
router.post(`/${process.env.APP_PREFIX}/:database/:collection`, authHandler, async(req, res, next) => {
    if (req.params.collection === 'users')
        return next('route');

    try {
        const updateDocs = req.body.filter(doc => doc._id !== undefined);
        const insertDocs = req.body.filter(doc => doc._id === undefined);

        const collection = getCollection(req.params.database, req.params.collection, CommonSchema);
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
                href: `/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${req.params.collection}/${doc._id}`
            });
        }

        updateDocs
            .map(doc => doc._id)
            .forEach((id, index) => {
                let { _id, ...data } = updateDocs[index];
                bulk.find({ _id: new ObjectID(id) }).update({ $set: data }, { new: true, useFindAndModify: false });
                response._embedded.push({
                    href: `/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${req.params.collection}/${id}`
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

router.post(`/${process.env.APP_PREFIX}/:database/users`, async(req, res) => {
    try {
        const User = getCollection(req.params.database, 'Users', UserSchema);
        const body = _.pick(req.body, ['email', 'username', 'password']);
        const user = new User(body);
        
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post(`/${process.env.APP_PREFIX}/:database/users/login`, async (req, res) => {
    try {
        const User = getCollection(req.params.database, 'Users', UserSchema);  
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
    
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});

module.exports = router;
