import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";
import { RequestBodyModel } from "../../models/CustomHttpModels";

import GroupMeService = require('../../services/gmeSvc');

export class SpewCommand implements Command {

  constructor() { }

  async execute(botRequestBody: RequestBodyModel): Promise<BotResponseModel> {
    const result = await GroupMeService.addSpew(botRequestBody.user_id);
    return new BotResponseModel(result, null);
  }
}