import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import BotService = require('./services/botSvc')
import DailyUserPostCounter = require('./models/Mongo/DailyUserPostCounterModel');
import { GroupmeMessageModel } from './models/Groupme/GroupmeMessageModel';

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
app.get('/', function (req: express.Request, res: express.Response) {
  return ping(res);
});
app.post('/', function (req: express.Request, res: express.Response) {
  const rawJson = JSON.stringify(req.body);
  console.log('This is the request object I got: ' + rawJson);
  let requestModel: GroupmeMessageModel = Object.assign(new GroupmeMessageModel(), req.body);
  return BotService.respond(requestModel, res);
});

// As of 2/2/2020 this is just for testing
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