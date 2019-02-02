'use strict';

const { ObjectID } = require('mongodb');

const items = [{
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492A",
    TS: 1493647468918,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492B",
    TS: 1493647468933,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492C",
    TS: 1493647468922,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492D",
    TS: 1493647468918,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492F",
    TS: 1493647468933,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492G",
    TS: 1493647468922,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492B",
    TS: 1493647468918,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492B",
    TS: 1493647468933,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492C",
    TS: 1493647468922,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}, {
    _id: new ObjectID(),
    ID: "4B4C45222321524536344B37575645415F3A3248492C",
    TS: 1493647468922,
    array: [ 1, 2, 3, 4, 5 ],
    obj: {
        a: 10,
        b: 20
    }
}];

module.exports = {
    items
};
