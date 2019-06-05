'use strict';

const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');

const { app } = require('../../../app.js');
const { CommonSchema } = require('../../models/common.js');
const { UserSchema } = require('./../../models/users.js');
const { items, users, populateItems, populateUsers } = require('../../seed/seed.tests.js');
const { getCollection } = require('../../db/mongoose.js');
const { curry } = require('./../../utils/utils.js');

const testCollection = 'Qlik_MSDashboard_test';

describe(`POST /${process.env.APP_PREFIX}/:database/:collection`, () => {
    
	beforeEach(curry(populateItems)(testCollection, CommonSchema, items));
	beforeEach(curry(populateUsers)('Users', UserSchema, users));

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
			.set('x-auth', users[0].tokens[0].token)
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

				const collection = getCollection(process.env.MONGO_DATABASE, testCollection, CommonSchema);
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
			.set('x-auth', users[0].tokens[0].token)
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

				const collection = getCollection(process.env.MONGO_DATABASE, testCollection, CommonSchema);
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
			.set('x-auth', users[0].tokens[0].token)
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

				const collection = getCollection(process.env.MONGO_DATABASE, testCollection, CommonSchema);

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

describe(`POST /${process.env.APP_PREFIX}/:database/users`, () => {
    
	beforeEach(curry(populateUsers)('Users', UserSchema, users));

	it('should create a user', done => {
		const email = 'dog123321@ukr.net';
		const password = 'password11111';

		request(app)
			.post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users`)
			.send({ email, password })
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err, res) => {
				if(err)
					return done(err);

				const User = getCollection(process.env.MONGO_DATABASE, 'Users', UserSchema);     

				User.findOne({ email }).then(user => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				});
			});
	});

	it('should return validation errors if request invalid', done => {
		const email = 'do';
		const password = 'password11111';

		request(app)
			.post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users`)
			.send({ email, password })
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', done => {
		const email = users[0].email;
		const password = 'userOnePass';

		request(app)
			.post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users`)
			.send({ email, password })
			.expect(400)
			.end(done);
	});
});

describe(`POST /${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users/login`, () => {

	beforeEach(curry(populateUsers)('Users', UserSchema, users));

	it('should return logged user', done => {
		request(app)
			.post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users/login`)
			.send({ email: users[1].email, password: users[1].password })
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if(err)
					return done(err);
                
				const User = getCollection(process.env.MONGO_DATABASE, 'Users', UserSchema);     

				User.findById(users[1]._id).then(user => {
					expect(user.tokens[1]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch(e => done(e));
			});
	});

	it('should return 400 if invalid credentials', done => {
		request(app)
			.post(`/${process.env.APP_PREFIX}/${process.env.MONGO_DATABASE}/users/login`)
			.send({ email: users[1].email, password: 'passValue' })
			.expect(400)
			.expect(res => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if(err)
					return done(err);

				const User = getCollection(process.env.MONGO_DATABASE, 'Users', UserSchema);     

				User.findById(users[1]._id).then(user => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch(e => done(e));
			});
	});
});