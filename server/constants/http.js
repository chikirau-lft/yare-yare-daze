'use strict';

const _ = require('lodash');

const { map } = require('../utils/utils.js');

const httpMethods = () => {
    return Promise.resolve(process.env.METHODS.split(',')).then(map(_.trim));
};

module.exports = {
    httpMethods
};
