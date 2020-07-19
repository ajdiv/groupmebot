import { BotResponseModel } from "../../models/BotResponseModel";
import { CommandList } from "../commandFactory";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

export class HelpCommand implements Command {

  commandText = ['/help'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'shows all available commands this bot knows';

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    let commandList = new CommandList();
    let helpText = commandList.getHelpText();
    const result = new BotResponseModel(helpText, null);
    return result;
  }
}