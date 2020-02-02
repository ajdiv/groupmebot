import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import bot = require('../services/botSvc')
import DailyUserPostCounter = require('../models/DailyUserPostCounterModel');
import { RequestBodyModel } from '../models/CustomHttpModels';

// Configure dev environment variables
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: 'config/env' });
}

// Configure DB
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configure Web Server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log('Server is running on PORT:', port);
});

// Define REST Methods
app.get('/', function (req, res) {
  return ping(res);
});
app.post('/', function (req, res) {
  const rawJson = JSON.stringify(req.body);
  console.log('This is the request object I got: '+ rawJson);
  let reqBody = createReqBody(req.body);
  return bot.respond(reqBody, res);
});

function createReqBody(reqBody: any): RequestBodyModel {
  return new RequestBodyModel(reqBody.text, reqBody.user_id, reqBody.group_id);
}

function ping(response: express.Response) {
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