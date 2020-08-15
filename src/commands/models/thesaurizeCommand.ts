import { BotResponse } from "../../bot/botResponse";
import { GroupmeTool } from "../../groupme/groupmeTool";
import { ThesaurusTool } from "../../tools/thesaurusTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export class ThesaurizeCommand implements Command {

  commandText = ['/thesaurize'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'get synonyms of the previous message';

  constructor() { }

  async execute(): Promise<BotResponse> {
    const lastText = await GroupmeTool.getLastMessageText();
    const result = await ThesaurusTool.thesaurize(lastText);
    return new BotResponse(result, null);
  }
}