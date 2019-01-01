'use strict';

const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const { app } = require('../../app.js');
const { CommonSchema } = require('../../models/common.js');

const { items } = require('../../seed/seed.tests.js');
const testCollection = 'Qlik_MSDashboard_test';

describe(`PATCH ${process.env.MONGO_DATABASE}/:collection/:_id`, () => {

    beforeEach(async() => {
        let collection = mongoose.model(testCollection, CommonSchema);
        await collection.deleteMany({});
        await collection.insertMany(items);
    });
    
    it('should update document fields', done => {
        request(app)
            .patch(`/${process.env.MONGO_DATABASE}/${testCollection}/${items[0]._id}`)
            .send({
                "array.1": 322,
                "array.2": 228,
                "obj.a": 11111,
                "TS": 0
            })
            .expect(200)
            .expect(res => {
                expect(res.body.array[1]).toBe(322);
                expect(res.body.array[2]).toBe(228);
                expect(res.body.obj.a).toBe(11111);
                expect(res.body.TS).toBe(0);
            })
            .end(done);
    });

    it('should update document fields with MongoDB operations', done => {
        request(app)
            .patch(`/${process.env.MONGO_DATABASE}/${testCollection}/${items[4]._id}`)
            .send({
                "$push": { "array": 700 }
            })
            .expect(200)
            .expect(res => {
                expect(res.body.array.length).toBe(items[4].array.length + 1);
            })
            .end(done);
    });

    it('should return 400 if _id field is invalid', done => {
        request(app)
            .patch(`/${process.env.MONGO_DATABASE}/${testCollection}/123`)
            .send({
                "array.1": 322,
                "array.2": 228,
                "obj.a": 11111,
                "TS": 0
            })
            .expect(400)
            .end(done);
    });

    it('should return 404 if document with such _id does not exists', done => {
        request(app)
            .patch(`/${process.env.MONGO_DATABASE}/${testCollection}/${new ObjectID()}`)
            .send({
                "array.1": 322,
                "array.2": 228,
                "obj.a": 11111,
                "TS": 0
            })
            .expect(404)
            .end(done);
    });
});