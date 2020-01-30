'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('disconnect', function (worker) {
        cluster.fork();
    });
} else {
    require('./server/app');
}
