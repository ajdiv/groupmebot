import { Bootstrapper } from './bootstrapper';
import { Bot } from "./bot";
import { BotResponseModel } from "./models/BotResponseModel";
import { EventsTool } from './tools/eventsTool';

// Configure dev environment variables
Bootstrapper.configureEnvVars();

// Configure DB
Bootstrapper.configureMongo();

(async () => {
  let events = await EventsTool.getTodaysEvents();
  if (events !== null) {
    let result = 'Event Happening Today: \n' + events;
    let eventList = new BotResponseModel(result, null);
    Bot.sendBotResponse(eventList).then(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
})()

