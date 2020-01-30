'use strict';

const _ = require('lodash');

const httpMethods = () => process.env.METHODS.split(',').map(_.trim);

module.exports = {
	httpMethods
};
