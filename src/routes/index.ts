//#region Load Modules, Services, and Models

// 3rd Part Libraries 
import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');

// Services
import bot = require('../services/botSvc')

// Models
import * as DailyUserPostCounter from '../models/dailyUserPostCounter.model';
//#endregion

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: 'config/env' });
}

let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var port = Number(process.env.PORT || 5000);
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
  console.log('Server is running on PORT:', port);
});

app.get('/', function (req, res) {
  return ping(req, res);
});

app.post('/', function (req, res) {
  return bot.respond(req, res);
});

function ping(request, response) {
  response.writeHead(200);

  var gmeId = 2; //TEST ONLY
  var groupId = 2; //TEST ONLY
  DailyUserPostCounter.findOne({ gmeUserId: gmeId }).then(result => {
    if (!result) {
      let counter = new DailyUserPostCounter({
        gmeUserId: gmeId,
        gmeGroupId: groupId,
        messageCount: 1,
        date: new Date()
      });
      return counter.save().then(res => {
        return response.end(`Created new user with id ${res.gmeUserId}`);
      });
    } else {
      result.messageCount++;
      return result.save().then((res) => {
        return response.end(`Updated user with message counter: ${result.messageCount}`);
      });
    }
  });
}