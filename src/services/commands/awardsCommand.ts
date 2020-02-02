import { BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";
import { GroupmeMessageModel } from "../../models/GroupmeMessageModel";

import AwardsService = require('../../services/awardSvc');
import GroupMeService = require('../../services/gmeSvc');

export class AwardsCommand implements Command {

  constructor() { }

  async execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel> {
    const allGroupMembers = await GroupMeService.getAllUsersInCurrentGroup();
    const result = await AwardsService.getAwards(botRequestBody.group_id, allGroupMembers);
    return Promise.resolve(new BotResponseModel(result, null));
  }
}