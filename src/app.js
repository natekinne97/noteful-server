require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
// endpoints
const folderRouter = require('./folder/folder-routes');
const notesRouter = require('./notes/notes-routes');


const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
//CORS middleware
app.use(cors());

// app.use(corsOptions);
app.options('*', cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// use endpoints
app.use(folderRouter);
app.use(notesRouter);

app.use(function errorHandler(error, req, res, next) {
    let response
    console.error(error)
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
       
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app