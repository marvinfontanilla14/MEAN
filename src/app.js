import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import config from './config/database'
// import api from './routes/api'
import userRoute from './routes/user-route'
import addressRoute from './routes/address-route'
import projectRoute from './routes/project-route'
// import serviceRoute from './routes/service-route'

import jwt from 'jsonwebtoken'
import User from './models/user'
import helmet from 'helmet'
import InitSocket from './sockets/init-socket'
const sockIO = require('socket.io')();


const app = express();
app.use(helmet());

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

mongoose.connect(config.database);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(passport.initialize());

app.sockIO = sockIO;

var initSocket = new InitSocket(sockIO);
initSocket.init();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use('/user', userRoute);
app.use('/address', addressRoute);
app.use('/project', projectRoute);
// app.use('/service', serviceRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});


console.log("ENV: "+app.get('env'));

module.exports = app;
