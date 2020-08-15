import { BotResponse } from "../../bot/botResponse";
import { CommandFactory } from "../commandFactory";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

export class HelpCommand implements Command {

  commandText = ['/help'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'shows all available commands this bot knows';

  constructor() { }

  async execute(): Promise<BotResponse> {
    let helpText = CommandFactory.getHelpText();
    const result = new BotResponse(helpText, null);
    return result;
  }
}