import { BotResponse } from "../../bot/botResponse";
import { GroupmeTool } from "../../groupme/groupmeTool";
import { Message } from "../../groupme/models/message";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export class SpewCommand implements Command {

  commandText = ['/spew'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'count how many times you spewed';

  constructor() { }

  async execute(botRequestBody: Message): Promise<BotResponse> {
    const result = await GroupmeTool.addSpew(parseInt(botRequestBody.user_id));
    return new BotResponse(result, null);
  }
}