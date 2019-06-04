'use strict';

const { UserSchema } = require('./../models/users.js');
const { getDatabaseConnection } = require('./../db/mongoose.js');

const authenticate = (req, res, next) => {
    const db = getDatabaseConnection(req.params.database);
    const User = db.model('Users', UserSchema);

    const token = req.header('x-auth');

    User.findByToken(token).then(user => {
        if (!user)
            return Promise.reject();

        req.user = user;
        req.token = token;
        next();
    }).catch(e => res.status(401).send());
};

module.exports = { 
    authenticate
};
