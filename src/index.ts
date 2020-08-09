import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Bot from './bot';
import container from "./inversify.config";
import GroupmeMessageModel from './models/Groupme/GroupmeMessageModel';

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
let bot = container.get<Bot>(Bot);
app.post('/', function (req: express.Request, res: express.Response): Promise<void> {
  const rawJson = JSON.stringify(req.body);
  console.log('Received: ' + rawJson);
  let requestModel: GroupmeMessageModel = Object.assign(new GroupmeMessageModel(), req.body);
  return bot.respond(requestModel, res);
});