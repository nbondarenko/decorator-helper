require('dotenv').config();
var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);
  require('./routes')(app, database);

  app.listen(app.get('port'), () => {
    console.log('We are live on ' + app.get('port'));
  });
})

app.get('/', function (request, response) {
  response.send('Hello World!');
});
