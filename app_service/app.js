var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var pdfRouter = require('./routes/pdf');
var usersRouter = require('./routes/users');
var dimensionRouter = require('./routes/dimensions');
var socialecoenvRouter = require('./routes/socialecoenvs');

var dotenv = require('dotenv')

var app = express();
var cors = require('cors')

// dotenv
dotenv.config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pdf', pdfRouter);
app.use('/users', usersRouter, dimensionRouter, socialecoenvRouter);


module.exports = app;
