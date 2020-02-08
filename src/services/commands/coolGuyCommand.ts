import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";

// Can't import this guy because it doesn't have any types
const cool = require('cool-ascii-faces');

export class CoolGuyCommand implements Command {

  constructor() { }

  execute(): Promise<BotResponseModel> {
    const result = cool();
    return Promise.resolve(new BotResponseModel(result, null));
  }
}