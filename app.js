'use strict';

require('./server/config/config.js');

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
    .use(require('./server/controllers/get.controllers'))
    .use(require('./server/controllers/post.controllers'))
    .use(require('./server/controllers/put.controllers'))
    .use(require('./server/controllers/patch.controllers'))
    .use(require('./server/controllers/delete.controllers'))
    .use(notFoundHandler)
    .use(clientErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, async () => {
    const message = `Server is up. HTTP connections is listened on port ${port}\n`;
    console.log(message);
});

module.exports = {
    app
};
