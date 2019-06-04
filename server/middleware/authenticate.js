'use strict';

const { UserSchema } = require('./../models/users.js');
const { getDatabaseConnection } = require('./../db/mongoose.js');

const authenticate = async (req, res, next) => {
    const db = getDatabaseConnection(req.params.database);
    const User = db.model('Users', UserSchema);

    try {
        const token = req.header('x-auth');
        const user = await User.findByToken(token);
        if (!user)
            return Promise.reject();
        
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        return res.status(401).send({
            statusCode: 401,
            ERROR: 'Unauthorized'
        });
    }
};

module.exports = { 
    authenticate
};
