import { BotResponseModel } from "../../models/BotResponseModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

import GroupMeService = require('../../services/gmeSvc');
import ThesaurusService = require('../../services/thesaurusSvc');

export class ThesaurizeCommand implements Command {

  commandText = ['/thesaurize'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'get synonyms of the previous message';

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    const lastText = await GroupMeService.getLastMessageText();
    const result = await ThesaurusService.thesaurize(lastText);
    return new BotResponseModel(result, null);
  }
}