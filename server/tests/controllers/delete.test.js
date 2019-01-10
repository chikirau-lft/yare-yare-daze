'use strict';

const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { app } = require('../../../app.js');
const { CommonSchema } = require('../../models/common.js');

const { items } = require('../../seed/seed.tests.js');
const testCollection = 'Qlik_MSDashboard_test';

describe(`DELETE ${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/:collection/:_id`, () => {

    beforeEach(async() => {
        let collection = mongoose.model(testCollection, CommonSchema);
        await collection.deleteMany({});
        await collection.insertMany(items);
    });
    
    it('should remove document from collection', done => {
        request(app)
            .delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${items[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual(
                    items
                        .filter(item => item._id === items[0]._id)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))[0]
                );
            })
            .end(async(err, res) => {
                if(err)
                    return done(err);

                const collection = mongoose.model(testCollection, CommonSchema);
                const document = await collection.findById(items[0]._id);
            
                expect(document).toBeNull();
                done();
            });
    });

    it('should return 400 if _id field is invalid', done => {
        request(app)
            .delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/123`)
            .expect(400)
            .end(done);
    });

    it('should return 404 if document with such _id does not exists', done => {
        request(app)
            .delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });
});

describe(`DELETE ${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/:collection/*?filter=...`, () => {

    beforeEach(async() => {
        let collection = mongoose.model(testCollection, CommonSchema);
        await collection.deleteMany({});
        await collection.insertMany(items);
    });

    it('should delete multiple documents specified by filter param', done => {
        request(app)
            .delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/*?filter={"TS": ${items[0].TS}}`)
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({
                    inserted: 0,
                    deleted: items.filter(element => element.TS === items[0].TS).length,
                    modified: 0,
                    matched: 0
                });
            })
            .end(async(err, res) => {
                if (err)
                    return done(err);

                const collection = mongoose.model(testCollection, CommonSchema);
                const documents = await collection.find({ TS: items[0] });

                expect(documents).toEqual([]);
                done();
            });
    });

    it('should return 400 status if invalid filter obj is spesified', done => {
        request(app)
            .delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/*?filter="TS": ${items[0].TS}}`)
            .expect(400)
            .expect(res => {
                expect(res.body).toMatchObject({
                    statusCode: 400
                })
            })
            .end(done);
    });
});