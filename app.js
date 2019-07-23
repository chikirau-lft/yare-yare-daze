'use strict';

require('./server/config/config.js');

const http = require('http');
const fs = require('fs');
const util = require('util');

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');

const appendFile = util.promisify(fs.appendFile);
const { logger } = require('./server/middleware/logs.js');
const { find } = require('./server/utils/utils.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger);
app.use(find(process.env.METHODS.split(',').map(e => e.trim()), 'GET') !== undefined ? require('./server/controllers/get.js') : async (req, res, next) => next());
app.use(find(process.env.METHODS.split(',').map(e => e.trim()), 'POST') !== undefined ? require('./server/controllers/post.js') : async (req, res, next) => next());
app.use(find(process.env.METHODS.split(',').map(e => e.trim()), 'PUT') !== undefined ? require('./server/controllers/put.js') : async (req, res, next) => next());
app.use(find(process.env.METHODS.split(',').map(e => e.trim()), 'PATCH') !== undefined ? require('./server/controllers/patch.js') : async (req, res, next) => next());
app.use(find(process.env.METHODS.split(',').map(e => e.trim()), 'DELETE') !== undefined ? require('./server/controllers/delete.js') : async (req, res, next) => next());

const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const message = `Server is up.HTTP connections is listened on port ${port}, date - ${time}\n`;
    
    await appendFile('logs.txt', message);

    console.log(find(process.env.METHODS.split(',').map(e => e.trim()), 'POST'));
    console.log(process.env.METHODS.split(',').map(e => e.trim()));
});

module.exports = {
    app
};
