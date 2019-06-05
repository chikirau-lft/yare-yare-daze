'use strict';

const { UserSchema } = require('./../models/users.js');
const { getCollection } = require('./../db/mongoose.js');

const authenticate = async (req, res, next) => {
    try {
        const User = getCollection(req.params.database, 'Users', UserSchema);

        const token = req.header('x-auth');
        const user = await User.findByToken(token);
        if (!user) {
            return res.status(401).send({
                statusCode: 401,
                ERROR: 'Unauthorized'
            });          
        }        
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

const authHandler = process.env.JWT_AUTH === 'true' ? authenticate : (req, res, next) => next();

module.exports = { 
    authHandler
};
