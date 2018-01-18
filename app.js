const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport')

const index = require('./server/routes/index');
const users = require('./server/routes/users');

// Database configuration
const config = require('./server/config/config')
// connect to the database
mongoose.connect(config.url)
// Check if the database is running
mongoose.connection.on('error', function() {
  console.error('Database connection error. Make sure your database is running')
})

// Initialize express
const app = express();

// Passport configuration
require('./server/config/passport')(passport)

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

/*
 * Middlewares Setup
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
