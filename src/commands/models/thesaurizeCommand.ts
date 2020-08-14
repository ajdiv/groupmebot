import { BotResponseModel } from "../../bot/models/botResponseModel";
import { GroupmeTool } from "../../tools/groupmeTool";
import { ThesaurusTool } from "../../tools/thesaurusTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";


export class ThesaurizeCommand implements Command {

  commandText = ['/thesaurize'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'get synonyms of the previous message';

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    const lastText = await GroupmeTool.getLastMessageText();
    const result = await ThesaurusTool.thesaurize(lastText);
    return new BotResponseModel(result, null);
  }
}