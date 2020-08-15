import { BotResponse } from "../../bot/botResponse";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

// Can't import this guy because it doesn't have any types
const cool = require('cool-ascii-faces');

export class CoolGuyCommand implements Command {

  commandText = ['/coolguy', '/cool guy'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'makes you a cool guy';

  constructor() { }

  execute(): Promise<BotResponse> {
    const result = cool();
    return Promise.resolve(new BotResponse(result, null));
  }
}