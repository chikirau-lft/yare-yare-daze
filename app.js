'use strict';

require('./server/config/config.js');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { logger } = require('./server/middleware/logs.js');
const { find } = require('./server/utils/utils.js');
const { middleware } = require('./server/constants/middleware.js');
const { httpMethods } = require('./server/constants/http.js');
const { errorResponse } = require('./server/utils/errors.js');

const app = express();
app
    .use(bodyParser.json())
    .use(cors())
    .use(async (req, res, next) => {
        const allowedMethods = await httpMethods();
        if (!allowedMethods.includes(req.method)) 
            return errorResponse(res, 405, 'Method Not Allowed.');
        next();
    })
    .use(require('./server/controllers/get.js'))
    .use(require('./server/controllers/post.js'))
    .use(require('./server/controllers/put.js'))
    .use(require('./server/controllers/patch.js'))
    .use(require('./server/controllers/delete.js'))
    .use((req, res, next) => {
        const err = new Error('Requested resourse not found.');
        err.status = 404;
        next(err);
    })
    .use(function(err, req, res, next) {
        return errorResponse(res, 400, err.message);
    });


const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
    const message = `Server is up. HTTP connections is listened on port ${port}\n`;
    console.log(message);
});

module.exports = {
    app
};
