
import { urlencoded } from 'body-parser';
import express from 'express';
import { connect, connection } from 'mongoose';
import { BotTool } from './bot/botTool';
import { Message } from './groupme/models/message';

// Configure dev environment variables
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: 'config/.env' });
}

// Configure DB
const mongoDB = process.env.MONGODB_URI;
if(!mongoDB) throw Error('Missing MONGODB_URI in env file');
connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configure Web Server
const app = express();
app.use(urlencoded({ extended: false }))
app.use(express.json())
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

// Define REST Methods
app.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  const rawJson = JSON.stringify(req.body);
  console.log('Received: ' + rawJson);
  let requestModel: Message = Object.assign(new Message(), req.body);
  res.writeHead(200);
  let responseText = await BotTool.readMessageAndRespond(requestModel);
  console.log(`Sending: ${responseText}`);
  res.end(responseText);
});