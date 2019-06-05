'use strict';

const mongoose = require('mongoose');

const CommonSchema = new mongoose.Schema({
	any: mongoose.Schema.Types.Mixed
}, {
	strict: false,
	versionKey: false
});

module.exports = {
	CommonSchema
};