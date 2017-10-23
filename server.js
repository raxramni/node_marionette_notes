'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const DB = require('./config/db');


const app = express();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'server/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

var routes = require('./server/routes/api/todoRoutes'); //importing route
routes(app); //register the route

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/*', function(req, res) {
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
