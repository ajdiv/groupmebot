import { BotResponseModel } from "../../models/BotResponseModel";
import { GroupmeMessageModel } from "../../models/Groupme/GroupmeMessageModel";
import { EventsTool } from "../../tools/eventsTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export abstract class EventCommand implements Command {

  commandText = ['/events'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'manage events. Type /events help for more info';

  constructor() { }

  async execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel> {
    const result = await this.executeEventType(botRequestBody);
    return new BotResponseModel(result, null);
  }

  private async executeEventType(botRequestBody: GroupmeMessageModel): Promise<string> {
    let text = botRequestBody.text;
    if (text.includes('add')) {
      return await EventsTool.addEvent(botRequestBody.user_id, botRequestBody.group_id, text);
    } else if (text.includes('list')) {
      return await EventsTool.getAllUpcomingEvents();
    } else if (text.includes('past')) {
      return await EventsTool.getAllPastEvents();
    }
    else return Promise.resolve('Unknown event command');
  }
}