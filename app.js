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

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger);
app.use(require('./server/controllers/patch.js'));
app.use(require('./server/controllers/get.js'));
app.use(require('./server/controllers/put.js'));
app.use(require('./server/controllers/post.js'));
app.use(require('./server/controllers/delete.js'));

const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const message = `Server is up. HTTP connections is listened on port ${port}, date - ${time}\n`;
    
    await appendFile('logs.txt', message);
});

module.exports = {
    app
};
