import { BotResponseModel } from "../../models/BotResponseModel";
import { GroupmeMessageModel } from "../../models/Groupme/GroupmeMessageModel";
import { GroupmeTool } from "../../tools/groupmeTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export class SpewCommand implements Command {

  commandText = ['/spew'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'count how many times you spewed';

  constructor() { }

  async execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel> {
    const result = await GroupmeTool.addSpew(parseInt(botRequestBody.user_id));
    return new BotResponseModel(result, null);
  }
}