const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

/* init connections to DBs etc */
require('./initialization/');

const auth = require('./auth');
const routes = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// compress all responses
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth.initialize());

// routes for testing
// if (app.get('env') === 'development' || app.get('env') === 'test') {
// }

app.use('/', routes);
app.use('/auth', require('./routes/auth'));
app.use('/api/v1/', require('./routes/api/v1'));

// catch 404 and forward to error handler
app.use('/api', (req, res, next) => {
  const err = new Error('Not Found');
  const errToSend = (app.get('env') === 'development') ? { message: err.message, error: err.stack } : { message: err.message };
  if (app.get('env') === 'development') {
    res.status(404).send(errToSend);
  }
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
