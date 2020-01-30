'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: true,
    }
});

module.exports = {
    SessionSchema
}
