'use strict';

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../../app');
const { CommonSchema } = require('../../models/common.models');
const { UserSchema } = require('./../../models/users.models');
const { items, users, populateItems, populateUsers } = require('../../seed/seed.tests');
const { getCollection } = require('../../db/mongoose.db');
const { curry } = require('../../utils/core.utils');
const { test_timeout } = require('../constants/mocha.constants');
const { testDatabase, testCollection } = require('../constants/db.constants');

describe(`PATCH /${process.env.APP_PREFIX}/:database/:collection/:_id`, function () {
	this.timeout(test_timeout);
	beforeEach(curry(populateItems)(testDatabase, testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)(testDatabase, 'Users', UserSchema, users));
    
	it('should update document fields', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/${items[0]._id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				'array.1': 322,
				'array.2': 228,
				'obj.a': 11111,
				TS: 0
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
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/${items[4]._id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				"$inc": { "TS": 1 },
				"$push": { "array": 700 },
				"$unset": { "obj": null }
			})
			.expect(200)
			.expect(res => {
				expect(res.body.TS).toBe(items[4].TS + 1);
				expect(res.body.array[res.body.array.length - 1]).toBe(700);
				expect(res.body.obj).toBeUndefined();
			})
			.end(done);
	});

	it('should return 400 if _id field is invalid', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/123`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				'array.1': 322,
				'array.2': 228,
				'obj.a': 11111,
				TS: 0
			})
			.expect(400)
			.end(done);
	});

	it('should return 404 if document with such _id does not exists', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/${new ObjectID()}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				'array.1': 322,
				'array.2': 228,
				'obj.a': 11111,
				TS: 0
			})
			.expect(404)
			.end(done);
	});
});

describe(`PATCH /${process.env.APP_PREFIX}/:database/:collection?filter=...`, function () {
	this.timeout(test_timeout);
	beforeEach(curry(populateItems)(testDatabase, testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)(testDatabase, 'Users', UserSchema, users));

	it('should update multiple documents specified by filter query', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}?filter={"TS": ${items[0].TS}}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				array: 'new array string'
			})
			.expect(200)
			.expect(res => {
				expect(res.body).toEqual({
					inserted: 0,
					deleted: 0,
					modified: items.filter(element => element.TS === items[0].TS).length,
					matched: 0
				});
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}
               
				const collection = await getCollection(testDatabase, testCollection, CommonSchema);
				const documents = await collection.find({ TS: items[0] });

				documents
					.map(d => d.toObject())
					.forEach(d => expect(d).toMatchObject({
						array: 'new array string'
					}));
				done();
			});
	});

	it('should update multiple documents specified by filter query with MongoDB operations', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}?filter={"TS": { $exists: true }}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				"$inc": { "TS": 1 },
				"$push": { "array": 700 },
				"$unset": { "obj": null }
			})
			.expect(200)
			.expect(res => {
				expect(res.body).toEqual({
					inserted: 0,
					deleted: 0,
					modified: items.filter(element => element.TS !== undefined).length,
					matched: 0
				});
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}
               
				const collection = await getCollection(testDatabase, testCollection, CommonSchema);
				const documents = await collection.find({ TS: { $exists: true } });

				documents
					.map(d => d.toObject())
					.forEach((d, i) => {
						expect(d.TS).toBe(items[i].TS + 1);
						expect(d.array[d.array.length - 1]).toBe(700);
						expect(d.obj).toBeUndefined();
					})

				done();
			});
	});

	it('should return 400 status if no filter obj spesified', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				array: 'new array string'
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					statusCode: 400
				});
			})
			.end(done);
	});

	it('should return 400 status if invalid filter obj is spesified', done => {
		request(app)
			.patch(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}?filter={"TS": ${items[0].TS}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				array: 'new array string'
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
