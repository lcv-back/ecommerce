const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
require('dotenv').config();


const app = express();


// init middeware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
checkOverload();

// init routes
app.use('/', require('./routers'));


// handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

// function to handler
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;