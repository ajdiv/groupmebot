import { BotResponseModel } from "../../models/BotResponseModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

import AwardsService = require('../../services/awardSvc');

export class AwardsCommand implements Command {

  commandText = ['/awards'];
  commandCheckLocation = CommandCheckLocation.Start;

  async execute(): Promise<BotResponseModel> {
    const result = await AwardsService.getAwards();
    return Promise.resolve(new BotResponseModel(result, null));
  }
}