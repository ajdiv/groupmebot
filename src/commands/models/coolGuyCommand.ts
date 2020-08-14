import { BotResponseModel } from "../../bot/models/botResponseModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

// Can't import this guy because it doesn't have any types
const cool = require('cool-ascii-faces');

export class CoolGuyCommand implements Command {

  commandText = ['/coolguy', '/cool guy'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'makes you a cool guy';

  constructor() { }

  execute(): Promise<BotResponseModel> {
    const result = cool();
    return Promise.resolve(new BotResponseModel(result, null));
  }
}