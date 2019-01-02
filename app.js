'use strict';

require('./server/config/config.js');
require('./server/db/mongoose.js');

const http = require('http');
// const https = require('https');
const fs = require('fs');
const util = require('util');

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const appendFile = util.promisify(fs.appendFile);

const { logger } = require('./server/middleware/logs.js');

const app = express();
app.use(bodyParser.json());
app.use(logger);
app.use(require('./server/controllers/get.js'));
app.use(require('./server/controllers/patch.js'));
app.use(require('./server/controllers/delete.js'));
app.use(require('./server/controllers/put.js'));

const httpServer = http.createServer(app);
// const httpsServer = https.createServer({
//     key: fs.readFileSync('sertificates/ryans-key.pem'),
//     cert: fs.readFileSync('sertificates/ryans-cert.pem')
// }, app);

httpServer.listen(process.env.PORT || 3000, async () => {
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const message = `Server is up. HTTP connections is listened on port ${process.env.PORT || 3000}, date - ${time}\n`;
    
    await appendFile('logs.txt', message);
});

// httpsServer.listen(8443, async() => {
//     const time = moment().format('MMMM Do YYYY, h:mm:ss a');
//     const message = `Server is up. HTTPS connections is listened on port ${8443}, date - ${time}\n`;
    
//     await appendFile('logs.txt', message);
// });

module.exports = {
    app
};