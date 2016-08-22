var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
require('./app_api/models/db');
var app = express();
var  api = require('./app_api/routers/index');
// view engine setup
console.log(process.env.NODE_ENV);
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// var Location = mongoose.model('Location');
// Location.create({
//   // "_id" : mongoose.Types.objectId("57b26c3f16fb6406ea6cec43"),
//   "name" : "Starnjcups",
//   "address" : "125 High Street, Reading, RG6 1PS",
//   "rating" : 3,
//   "facilities" : [
//     "Hot drinks",
//     "Food",
//     "Premium wifi"
//   ],
//   "coords" : [
//     -0.9690884,
//     51.455041
//   ],
//   "openingTimes" : [
//     {
//       "days" : "Monday - Friday",
//       "opening" : "7:00am",
//       "closing" : "7:00pm",
//       "closed" : false
//     },
//     {
//       "days" : "Saturday",
//       "opening" : "8:00am",
//       "closing" : "5:00pm",
//       "closed" : false
//     },
//     {
//       "days" : "Sunday",
//       "closed" : true
//     }
//   ],
//   "reviews" : [
//     {
//       "author" : "Simon Holmes",
//       // "_id" : mongoose.Types.ObjectId("57b26db716fb6406ea6cec44"),
//       "rating" : 5,
//       "timestamp" : new Date("2013-07-15T18:30:00Z"),
//       "reviewText" : "What a great place. I can't say enough good"
//     }
//   ]
// },function (err) {
//   console.log(err,'mo');
// });

module.exports = app;
