import { Bootstrapper } from './bootstrapper';
import { Bot } from "./bot";
import { BotResponseModel } from "./models/BotResponseModel";

// Configure dev environment variables
Bootstrapper.configureEnvVars();

// Configure DB
Bootstrapper.configureMongo();

let test = new BotResponseModel('hey', null);
Bot.sendBotResponse(test);