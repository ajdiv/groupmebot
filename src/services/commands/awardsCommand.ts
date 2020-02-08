import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";

import AwardsService = require('../../services/awardSvc');
import GroupMeService = require('../../services/gmeSvc');

export class AwardsCommand implements Command {

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    const result = await AwardsService.getAwards();
    return Promise.resolve(new BotResponseModel(result, null));
  }
}