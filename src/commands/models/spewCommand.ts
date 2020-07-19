import { BotResponseModel } from "../../models/BotResponseModel";
import { GroupmeMessageModel } from "../../models/Groupme/GroupmeMessageModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

import GroupMeService = require('../../services/gmeSvc');

export class SpewCommand implements Command {

  commandText = ['/spew'];
  commandCheckLocation = CommandCheckLocation.Start;

  constructor() { }

  async execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel> {
    const result = await GroupMeService.addSpew(parseInt(botRequestBody.user_id));
    return new BotResponseModel(result, null);
  }
}