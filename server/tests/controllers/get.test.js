'use strict';

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../../../app.js');
const { CommonSchema } = require('../../models/common.js');
const { UserSchema } = require('./../../models/users.js'); 
const { items, users, populateUsers, populateItems } = require('../../seed/seed.tests.js');
const { curry } = require('./../../utils/utils.js');

const testCollection = 'Qlik_MSDashboard_test';

describe(`GET /${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/:collection`, () => {

    beforeEach(curry(populateItems)(testCollection, CommonSchema, items));
    beforeEach(curry(populateUsers)('Users', UserSchema, users));

    it('should return all process.env.DEFAULT_PAGESIZE n documents if no params is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(+process.env.DEFAULT_PAGESIZE);
                expect(res.body._id).toBe(testCollection);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .slice(0, +process.env.DEFAULT_PAGESIZE)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return filtered documents if filter param is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={ "ID": "${items[0].ID}"}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[0].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })  
            .end(done);
    });

    it('should return filtered documnts if filter params is coma separated array', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={'$or':[{'ID': '${items[0].ID}'}, {'ID': '${items[2].ID}'}]}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[0].ID || item.ID === items[2].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID || item.ID === items[2].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return filtered documnts if filter params is NOT coma separated array', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={'$or':[{'ID': '${items[0].ID}'} {'ID': '${items[2].ID}'}]}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[0].ID || item.ID === items[2].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID || item.ID === items[2].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return 400 if filter param is invalid JSON string', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={ ID': '${items[0].ID}'`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .expect(res => {
                expect(res.body).toMatchObject({ statusCode: 400 });
            })
            .end(done);
    });

    it('should return sorted documents if sort param is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={"ID": "${items[2].ID}"}&sort={"_id": -1}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[2].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[2].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                        .sort((a, b) => (a._id > b._id) ? -1 : ((b._id > a._id) ? 1 : 0))
                );
            })
            .end(done);
    });

    it('should return 400 if sort param is invalid JSON string', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?sort={_id": -1}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .expect(res => {
                expect(res.body).toMatchObject({ statusCode: 400 });
            })
            .end(done);
    });

    it('should return certain number of documents if pagesize param is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={ "ID": "${items[2].ID}"}&sort={"_id": -1}&pagesize=2`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(2);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[2].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                        .sort((a, b) => (a._id > b._id) ? -1 : ((b._id > a._id) ? 1 : 0))
                        .slice(0, 2)
                );
            })
            .end(done);
    });

    it('should return default number of documents if pagesize params if over max', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?&pagesize=9`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(+process.env.DEFAULT_PAGESIZE);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .slice(0, +process.env.DEFAULT_PAGESIZE)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return certain page if page param is specified', done => {
        const pagesize = 3;
        const page = 2;

        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?&pagesize=${pagesize}&page=${page}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(3);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .slice(page * pagesize - pagesize, page * pagesize)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return properties if count param is true', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?&count=true`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(+process.env.DEFAULT_PAGESIZE);
                expect(res.body._id).toBe(testCollection);
                expect(res.body._size).toBe(items.length);
                expect(res.body._total_pages).toBe(Math.ceil(items.length / +process.env.DEFAULT_PAGESIZE));
                expect(res.body._embedded).toEqual(
                    items
                        .slice(0, +process.env.DEFAULT_PAGESIZE)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })
            .end(done);
    });

    it('should return only certain fields if keys param is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={ "ID": "${items[0].ID}"}&keys={"TS": 1}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[0].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID)
                        .map(item => {
                            const { ID, array, obj, ...withoutID } = item;
                            return Object.assign({}, withoutID, { _id: withoutID._id.toHexString() })
                        })
                );
            })  
            .end(done);
    });

    it('should return only certain fields if keys param is specified as an array', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={"ID": "${items[0].ID}"}&keys={"TS": 1}&keys={"ID": 1}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(items.filter(item => item.ID === items[0].ID).length);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID)
                        .map(item => {
                            const { array, obj, ...without } = item;
                            return Object.assign({}, without, { _id: without._id.toHexString() })
                        })
                );
            })  
            .end(done);
    });

    it('should hide properties if np param is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}?filter={"ID": "${items[0].ID}"}&np`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(undefined);
                expect(res.body._size).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._total_pages).toBe(undefined);
                expect(res.body._embedded).toBe(undefined);
                expect(res.body).toEqual(
                    items
                        .filter(item => item.ID === items[0].ID)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))
                );
            })  
            .end(done);
    });

    it('should return empty JSON array if invalid collection is specified', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/col?filter={ "ID": "${items[0].ID}"}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._returned).toBe(0);
                expect(res.body._id).toBe('col');
                expect(res.body._embedded).toEqual([]);
            })
            .end(done);
    });
});

describe(`GET /${process.env.APP_PREFIX}/:database/:collection/:_id`, () => {

    beforeEach(curry(populateItems)(testCollection, CommonSchema, items));

    it('should return document with specified _id field', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${items[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual(
                    items
                        .filter(item => item._id === items[0]._id)
                        .map(item => Object.assign({}, item, { _id: item._id.toHexString() }))[0]
                );
            })
            .end(done);
    });

    it('should return 400 if _id field is invalid', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/123rr`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it('should return 404 if document with such _id does not exists', done => {
        request(app)
            .get(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${new ObjectID()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});
