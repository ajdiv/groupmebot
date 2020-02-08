import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";

import GroupMeService = require('../../services/gmeSvc');
import ThesaurusService = require('../../services/thesaurusSvc');

export class ThesaurizeCommand implements Command {

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    const lastText = await GroupMeService.getLastMessageText();
    const result = await ThesaurusService.thesaurize(lastText);
    return new BotResponseModel(result, null);
  }
}