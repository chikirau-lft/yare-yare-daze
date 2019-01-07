'use strict';

const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { app } = require('../../../app.js');
const { CommonSchema } = require('../../models/common.js');

const { items } = require('../../seed/seed.tests.js');
const testCollection = 'Qlik_MSDashboard_test';

describe(`POST /mongo/${process.env.MONGO_DATABASE}/:collection`, () => {
    
    beforeEach(async() => {
        let collection = mongoose.model(testCollection, CommonSchema);
        await collection.deleteMany({});
        await collection.insertMany(items);
    });

    it('should insert documents if _id is not specified', done => {
        let data = [{
            text: 'text 1',
            number: 2000
        }, {
            text: 'text 2',
            number: 3000
        }];

        request(app)
            .post(`/mongo/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body).toMatchObject({
                    inserted: data.length,
                    deleted: 0,
                    modified: 0,
                    matched: 0
                })
            })
            .end(async(err, res) => {
                if (err)
                    done(err);

                const collection = mongoose.model(testCollection, CommonSchema);
                const documents = await collection.find({
                    _id: { $in: res.body._embedded.map(d => _.last(d.href.split('/'))) }
                }, { '_id': 0 });

                expect(documents.map(d => d.toObject())).toEqual(data);
                done();
            });
        });
});