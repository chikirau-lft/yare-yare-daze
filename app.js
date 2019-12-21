'use strict';

require('./server/config/config.js');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');
const _ = require('lodash');

const { logger } = require('./server/middleware/logs.js');
const { find } = require('./server/utils/utils.js');
const { middleware } = require('./server/constants/middleware.js');
const { httpMethods } = require('./server/constants/http.js');
const { errorResponse } = require('./server/utils/errors.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger);

(async () => {
    const methodsArr = await httpMethods();
    app.use(find(methodsArr, 'GET') !== undefined ? require('./server/controllers/get.js') : middleware);
    app.use(find(methodsArr, 'POST') !== undefined ? require('./server/controllers/post.js') : middleware);
    app.use(find(methodsArr, 'PUT') !== undefined ? require('./server/controllers/put.js') : middleware);
    app.use(find(methodsArr, 'PATCH') !== undefined ? require('./server/controllers/patch.js') : middleware);
    app.use(find(methodsArr, 'DELETE') !== undefined ? require('./server/controllers/delete.js') : middleware);
    app.use((req, res, next) => {
        const err = new Error('Requested resourse not found.');
        err.status = 404;
        next(err);
    })
    app.use(function(err, req, res, next) {
        return errorResponse(res, 400, err.message);
    });
})();

const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const message = `Server is up.HTTP connections is listened on port ${port}, date - ${time}\n`;
    console.log(message);
});

module.exports = {
    app
};
