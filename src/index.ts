
import { urlencoded } from 'body-parser';
import express from 'express';
import { Bootstrapper } from './bootstrapper';
import { Bot } from './bot';
import { GroupmeMessageModel } from './models/Groupme/GroupmeMessageModel';

// Configure dev environment variables
Bootstrapper.configureEnvVars();

// Configure DB
Bootstrapper.configureMongo();

// Configure Web Server
const app = express();
app.use(urlencoded({ extended: false }))
app.use(express.json())
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

// Define REST Methods
app.post('/', function (req: express.Request, res: express.Response): Promise<void> {
  const rawJson = JSON.stringify(req.body);
  console.log('Received: ' + rawJson);
  let requestModel: GroupmeMessageModel = Object.assign(new GroupmeMessageModel(), req.body);
  return Bot.respond(requestModel, res);
});