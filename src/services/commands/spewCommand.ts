import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";
import { GroupmeMessageModel } from "../../models/GroupmeMessageModel";

import GroupMeService = require('../../services/gmeSvc');

export class SpewCommand implements Command {

  constructor() { }

  async execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel> {
    const result = await GroupMeService.addSpew(parseInt(botRequestBody.user_id));
    return new BotResponseModel(result, null);
  }
}