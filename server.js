var express = require('express'),
mongoose = require('mongoose'),
fs = require('fs');

var mongoUri =
    process.env.MONGOLAB_URI ||
    'mongodb://localhost/gtsga-projectqueue';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();

require('./models/card');
require('./routes')(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Listening on port 5000...');
