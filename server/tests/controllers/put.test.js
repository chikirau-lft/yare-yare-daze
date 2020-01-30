'use strict';

const { ObjectID } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('../../app');
const { CommonSchema } = require('../../models/common.models');
const { UserSchema } = require('./../../models/users.models');
const { items, users, populateItems, populateUsers } = require('../../seed/seed.tests');
const { getCollection } = require('../../db/mongoose.db');
const { curry } = require('../../utils/core.utils');
const { test_timeout } = require('../constants/mocha.constants');
const { testDatabase, testCollection } = require('../constants/db.constants');

describe(`PUT /${process.env.APP_PREFIX}/:database/:collection`, function () {
	this.timeout(test_timeout);
	beforeEach(curry(populateItems)(testDatabase, testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)(testDatabase, 'Users', UserSchema, users));
    
	it('should update document if _id specified', done => {
		const json = {
			ID: 'updated value',
			old: 'new value'
		};

		request(app)
			.put(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/${items[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(json)
			.expect(200)
			.expect(res => {
				expect(res.body).toMatchObject(json);
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}

				const collection = await getCollection(testDatabase, testCollection, CommonSchema);
				const documents = await collection.find({});
				const updated = await collection.findOne({ _id: items[0]._id });
				updated._doc._id = updated._doc._id.toHexString();

				expect(documents.length).toBe(items.length);
				expect(updated._doc).toMatchObject(json);
				done();
			});
	});

	it('should create new document if _id field is not specofied', done => {
		const json = {
			ID: 'updated value',
			old: 'new value'
		};

		request(app)
			.put(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/${new ObjectID()}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(json)
			.expect(200)
			.expect(res => {
				expect(res.body).toMatchObject(json);
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}

				const collection = await getCollection(testDatabase, testCollection, CommonSchema);
				const documents = await collection.find({});
				const inserted = await collection.findOne(res.body);

				expect(documents.length).toBe(items.length + 1);
				expect(inserted._doc).toMatchObject(json);
				done();
			});
	});

	it('should return 400 if ObjectId is not valid', done => {
		request(app)
			.put(`/${process.env.APP_PREFIX}/${testDatabase}/${testCollection}/123qwert`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
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
