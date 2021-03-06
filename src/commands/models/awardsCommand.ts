import { BotResponseModel } from "../../models/BotResponseModel";
import { AwardsTool } from "../../tools/awardsTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export class AwardsCommand implements Command {

  constructor() {}

  commandText = ['/awards'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'gets the most active and most liked messages from today';

  async execute(): Promise<BotResponseModel> {
    const result = await AwardsTool.getAwards();
    return Promise.resolve(new BotResponseModel(result, null));
  }
}