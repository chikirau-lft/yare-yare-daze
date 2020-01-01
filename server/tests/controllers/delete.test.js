'use strict';

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../../../app');
const { CommonSchema } = require('../../models/common');
const { UserSchema } = require('./../../models/users');
const { items, users, populateItems, populateUsers } = require('../../seed/seed.tests');
const { getCollection } = require('../../db/mongoose.db');
const { curry } = require('./../../utils/utils');

const testCollection = 'Qlik_MSDashboard_test';

describe(`DELETE ${process.env.APP_PREFIX}/:database/:collection/:_id`, function () {
	this.timeout(10000);
	beforeEach(curry(populateItems)(testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)('Users', UserSchema, users));
    
	it('should remove document from collection', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${items[0]._id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body).toEqual(
					items
						.filter(item => item._id === items[0]._id)
						.map(item => Object.assign({}, item, { _id: item._id.toHexString() }))[0]
				);
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}

				const collection = getCollection(process.env.MONGO_DATABASE, testCollection, CommonSchema);
				const document = await collection.findById(items[0]._id);
            
				expect(document).toBeNull();
				done();
			});
	});

	it('should return 400 if _id field is invalid', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/123`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(400)
			.end(done);
	});

	it('should return 404 if document with such _id does not exists', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/${new ObjectID()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe(`DELETE ${process.env.APP_PREFIX}/:databse/:collection/*?filter=...`, function () {
	this.timeout(10000);
	beforeEach(curry(populateItems)(testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)('Users', UserSchema, users));

	it('should delete multiple documents specified by filter param', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/*?filter={"TS": ${items[0].TS}}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body).toEqual({
					inserted: 0,
					deleted: items.filter(element => element.TS === items[0].TS).length,
					modified: 0,
					matched: 0
				});
			})
			.end(async (err, res) => {
				if (err) {
					return done(err);
				}

				const collection = getCollection(process.env.MONGO_DATABASE, testCollection, CommonSchema);
				const documents = await collection.find({ TS: items[0] });

				expect(documents).toEqual([]);
				done();
			});
	});

	it('should return 400 status if invalid filter obj is spesified', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/${testCollection}/*?filter="TS": ${items[0].TS}}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					statusCode: 400
				});
			})
			.end(done);
	});
});

describe(`DELETE ${process.env.APP_PREFIX}/:databse/users/token`, function () {
	this.timeout(10000);
	beforeEach(curry(populateUsers)('Users', UserSchema, users));
	before(function () {
		if (process.env.JWT_AUTH !== 'true') {
			this.skip();
		}
	});

	it('should remove token', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users/token`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				const User = getCollection(process.env.MONGO_DATABASE, 'Users', UserSchema);

				User.findById(users[0]._id).then(user => {
					expect(user.tokens.length).toBe(0);
					done();
				})
					.catch(e => done(e));
			});
	});

	it('should return 401 if token already deleted', done => {
		request(app)
			.delete(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users/token`)
			.set('x-auth', `${users[0].tokens[0].token }abf6`)
			.expect(401)
			.end(done);
	});
});
