import { injectable } from "inversify";
import { CommandCheckLocation } from "./constants/commandCheckLocation";
import { AwardsCommand } from "./models/awardsCommand";
import { Command } from "./models/command";
import { CoolGuyCommand } from "./models/coolGuyCommand";
import { HelpCommand } from "./models/helpCommand";
import { HereCommand } from "./models/hereCommand";
import { SpewCommand } from "./models/spewCommand";
import { ThesaurizeCommand } from "./models/thesaurizeCommand";
import { WednesdayCommand } from "./models/wednesdayCommand";
import _ = require("lodash");

@injectable()
export default class CommandFactory {
  private readonly commandList: Command[] = [
    new AwardsCommand(),
    new CoolGuyCommand(),
    new HereCommand(),
    new SpewCommand(),
    new ThesaurizeCommand(),
    new WednesdayCommand(),
    new HelpCommand()
  ];

  getCommand(text: string): Command {
    if (!text) return null;

    let result: Command = null;
    this.commandList.forEach(
      (command: Command) => {
        let isMatch = this.doesCmdTextMatch(text, command);
        if (isMatch) result = command;
      });
    return result;
  }

  getHelpText(): string {
    let result = '';
    this.commandList.forEach(
      (command: Command) => {
        let commandText = _.join(command.commandText,' or ');
        result += `${commandText}: ${command.helpText}`;
        result += '\n';
      })
    return result;
  }

  private doesCmdTextMatch(messageTxt: string, command: Command): boolean {
    let match = false;
    for (let i = 0; i < command.commandText.length; i++) {
      let commandTxt = command.commandText[i];
      switch (command.commandCheckLocation) {
        case CommandCheckLocation.Start:
          match = messageTxt.startsWith(commandTxt);
          break;
        case CommandCheckLocation.Contains:
          match = messageTxt.includes(commandTxt);
          break;
        case CommandCheckLocation.End:
          match = messageTxt.endsWith(commandTxt);
          break;
        default:
          throw new Error(`Cannot find parse method for command: ${commandTxt}`);
      }
      if (match) break; // Stop once we found a match
    }
    return match;
  }
}