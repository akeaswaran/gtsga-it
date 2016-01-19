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

//App setup
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

require('./models/card');
require('./routes')(app);

//post listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
