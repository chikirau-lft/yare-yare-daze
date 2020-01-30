'use strict';

const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { getCollection } = require('../db/mongoose.db');

const items = [{
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492A',
	TS: 1493647468918,
	array: [ 1, 2, 3, 4, 5, 6, 7, 8 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492B',
	TS: 1493647468933,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492C',
	TS: 1493647468922,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492D',
	TS: 1493647468918,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492F',
	TS: 1493647468933,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492G',
	TS: 1493647468922,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 20
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492B',
	TS: 1493647468918,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 8,
		b: 10
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492B',
	TS: 1493647468933,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 3,
		b: 5
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492C',
	TS: 1493647468922,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 10,
		b: 2
	}
}, {
	_id: new ObjectID(),
	ID: '4B4C45222321524536344B37575645415F3A3248492C',
	TS: 1493647468922,
	array: [ 1, 2, 3, 4, 5 ],
	obj: {
		a: 1,
		b: 20
	}
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users =[{
	_id: userOneId,
	email: 'email111@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoId,
	email: 'email222@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
	}]
}];

const populateItems = async (dbName, colName, schema, data) => {
	const col = await getCollection(dbName, colName, schema);
	await col.deleteMany({});
	await col.insertMany(data);
};

const populateUsers = async (dbName, colName, schema, data) => {
	const User = await getCollection(dbName, colName, schema);
	await User.deleteMany({});
	await Promise.all(data.map(user => new User(user).save()));
};

module.exports = {
	items,
	users,
	populateItems,
	populateUsers
};
