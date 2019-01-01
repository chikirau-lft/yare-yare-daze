'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.pluralize(null);
mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}`, {
    useNewUrlParser: true
});

module.exports = {
    mongoose
};