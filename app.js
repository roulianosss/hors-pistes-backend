require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const docsRouter = require('./routes/docs');
const usersRouter = require('./routes/users');
const missionsRouter = require('./routes/missions');
const structuresRouter = require('./routes/structures');
const referantsRouter = require('./routes/referants');
require('./models/connection')

const app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs', docsRouter);
app.use('/missions', missionsRouter);
app.use('/structures', structuresRouter);
app.use('/referants', referantsRouter);


const User = require("./models/users");



module.exports = app;
