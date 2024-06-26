'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000

// count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
}

// check overload connect
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // example the maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        // condition to overload connect:
        if (numConnections > maxConnections) {
            console.log(`Number of connections: ${numConnections}`);
            console.log(`Number of cores: ${numCores}`);
            console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
            console.log(`Overload Connect`);
        }

    }, _SECONDS); // monitoring every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
};