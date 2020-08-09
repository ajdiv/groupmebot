import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import container from "./inversify.config";
import GroupmeMessageModel from './models/Groupme/GroupmeMessageModel';
import BotService from './services/botSvc';

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
let botSvc = container.get<BotService>(BotService);
app.post('/', function (req: express.Request, res: express.Response) {
  const rawJson = JSON.stringify(req.body);
  console.log('This is the request object I got: ' + rawJson);
  let requestModel: GroupmeMessageModel = Object.assign(new GroupmeMessageModel(), req.body);
  return botSvc.respond(requestModel, res);
});