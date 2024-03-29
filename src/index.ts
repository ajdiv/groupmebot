
import { urlencoded } from 'body-parser';
import express from 'express';
import { connect } from 'mongoose';
import path from 'path';
import { Bot } from './bot';
import { GroupmeMessageModel } from './models/Groupme/GroupmeMessageModel';

// Configure dev environment variables
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  const { error } = dotenv.config({ debug: true, path: path.join(__dirname, '../config/.env') });

  if(error) console.error(error);
}

const app = express();
app.use(urlencoded({ extended: false }))
app.use(express.json())

// Configure DB
// const mongoDB = process.env.MONGODB_URI;
// if (!mongoDB) throw Error('Missing MONGODB_URI in env file');
// connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// Define REST Methods
app.post('/', function (req: express.Request, res: express.Response): Promise<void> {
  const rawJson = JSON.stringify(req.body);
  console.log('Received: ' + rawJson);
  let requestModel: GroupmeMessageModel = Object.assign(new GroupmeMessageModel(), req.body);
  return Bot.respond(requestModel, res);
});

// Define REST Methods
app.get('/', function(req, res) {
  res.json({
    number: 1
  });
});

// Configure Web Server
const port = Number(process.env.PORT || 5000);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
  })
})