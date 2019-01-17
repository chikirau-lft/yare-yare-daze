'use strict';

const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { app } = require('../../../app.js');
const { CommonSchema } = require('../../models/common.js');
const { items } = require('../../seed/seed.tests.js');
const { getDatabaseConnection } = require('../../db/mongoose.js');

const testCollection = 'Qlik_MSDashboard_test';

describe(`PUT /${process.env.APP_PREFIX}/:database/:collection`, () => {
    
    beforeEach(async() => {
        const db = getDatabaseConnection(process.env.MONGO_DATABASE);
        const collection = db.model(testCollection, CommonSchema);
        await collection.deleteMany({});
        await collection.insertMany(items);
    });
    
    it('should update document if _id is send in request body', done => {
        const json = {
            _id: items[0]._id.toHexString(),
            ID: 'updated value',
            old: 'new value'
        };

        request(app)
            .put(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(json)
            .expect(200)
            .expect(res => {
                expect(res.body).toMatchObject(json);
            })
            .end(async(err, res) => {
                if(err)
                    return done(err);

                const db = getDatabaseConnection(process.env.MONGO_DATABASE);
                const collection = db.model(testCollection, CommonSchema);
                const documents = await collection.find({});
                const updated = await collection.findOne({ _id: items[0]._id });
                updated._doc._id = updated._doc._id.toHexString();

                expect(documents.length).toBe(items.length);
                expect(updated._doc).toMatchObject(json);

                done();
            });
    });

    it('should create new document if _id field is not specofied in request body', done => {
        const json = {
            ID: 'updated value',
            old: 'new value'
        };

        request(app)
            .put(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(json)
            .expect(200)
            .expect(res => {
                expect(res.body).toMatchObject(json);
            })
            .end(async(err, res) => {
                if(err)
                    return done(err);

                const db = getDatabaseConnection(process.env.MONGO_DATABASE);
                const collection = db.model(testCollection, CommonSchema);
                const documents = await collection.find({});
                const inserted = await collection.findOne(res.body);

                expect(documents.length).toBe(items.length + 1);
                expect(inserted._doc).toMatchObject(json);

                done();
            });
    });

    it('should return 400 if ObjectId is not valid', done => {
        request(app)
            .put(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send({
                _id: '132gd',
                data: [1, 2, 3]
            })
            .expect(400)
            .expect(res => {
                expect(res.body).toMatchObject({
                    statusCode: 400
                });
            })
            .end(done);
    });
});