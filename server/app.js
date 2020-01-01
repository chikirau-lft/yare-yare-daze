'use strict';

require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { 
    methodsHandler,
    clientErrorHandler,
    notFoundHandler 
} = require('./middlewares/http.middlewares');

const app = express();
app
    .use(bodyParser.json())
    .use(cors())
    .use(methodsHandler)
    .use(require('./controllers/get.controllers'))
    .use(require('./controllers/post.controllers'))
    .use(require('./controllers/put.controllers'))
    .use(require('./controllers/patch.controllers'))
    .use(require('./controllers/delete.controllers'))
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
