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

describe(`POST /${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/:collection`, () => {
    
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
            .post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body).toMatchObject({
                    inserted: data.length,
                    deleted: 0,
                    modified: 0,
                    matched: 0
                });
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

    it('should update documents if _id is specified', done => {
        let data = [{
            _id: items[items.length - 2]._id,
            text: 'text 2',
            number: 3000,
            TS: 0
        }, {
            _id: items[items.length - 1]._id,
            text: 'text 1',
            number: 2000,
            TS: 0
        }];

        request(app)
            .post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(data)
            .expect(200)
            .expect(res => {
                const _embedded = data.map(d => { 
                    return { href: `/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${d._id.toHexString()}`};
                });
                expect(res.body).toEqual({
                    _embedded: _embedded,
                    inserted: 0,
                    deleted: 0,
                    modified: data.length,
                    matched: data.length
                });
            })
            .end(async(err, res) => {
                if(err)
                    done(err);

                const collection = mongoose.model(testCollection, CommonSchema);
                const documents = await collection.find({
                    _id: { $in: res.body._embedded.map(d => _.last(d.href.split('/'))) }
                });

                expect(documents.map(d => d.toObject())).toMatchObject(data);
                done();
            });
    });

    it('should both update and insert', done => {
        let data = [{
            text: 'custom text',
        }, {
            _id: items[items.length - 1]._id,
            text: 'text 1',
            number: 2000,
            TS: 0
        }];

        request(app)
            .post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body).toMatchObject({
                    inserted: 1,
                    deleted: 0,
                    modified: 1,
                    matched: 1
                });
            })
            .end(async(err, res) => {
                if(err)
                    done(err);

                const collection = mongoose.model(testCollection, CommonSchema);
                const count = await collection.countDocuments({});
                const updated = await collection.find({ _id: _.last(data)._id.toHexString() });
                const inserted = await collection.find({ 
                     _id: res.body._embedded
                        .filter(d => _.last(d.href.split('/')) !== _.last(data)._id.toHexString())
                        .map(d => _.last(d.href.split('/')))
                }, { _id: 0 });

                expect(count).toBe(items.length + inserted.length);
                expect(updated[0].toObject()).toMatchObject(data[1]);
                expect(inserted[0].toObject()).toEqual(data[0]);
                done();
            });
    });
});