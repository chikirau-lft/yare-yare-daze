'use strict';

require('./server/config/config.js');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { 
    methodsHandler,
    clientErrorHandler,
    notFoundHandler 
} = require('./server/middlewares/http.middlewares');

const app = express();
app
    .use(bodyParser.json())
    .use(cors())
    .use(methodsHandler)
    .use(require('./server/controllers/get.js'))
    .use(require('./server/controllers/post.js'))
    .use(require('./server/controllers/put.js'))
    .use(require('./server/controllers/patch.js'))
    .use(require('./server/controllers/delete.js'))
    .use(notFoundHandler)
    .use(clientErrorHandler);


const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
httpServer.listen(port, async () => {
    const message = `Server is up. HTTP connections is listened on port ${port}\n`;
    console.log(message);
});

module.exports = {
    app
};
