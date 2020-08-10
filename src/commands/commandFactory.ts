import { injectable } from "inversify";
import { CommandCheckLocation } from "./constants/commandCheckLocation";
import allCommands from './constants/commandList';
import { Command } from "./models/command";
import _ = require("lodash");

@injectable()
export default class CommandFactory {

  getCommand(text: string): Command {
    if (!text) return null;
    let result: Command = null;

    let commandList = this.generateCommandList();
    commandList.forEach(
      (command: Command) => {
        let isMatch = this.doesCmdTextMatch(text, command);
        if (isMatch) result = command;
      });
    return result;
  }

  getHelpText(): string {
    let result = '';
    let commandList = this.generateCommandList();
    commandList.forEach(
      (command: Command) => {
        let commandText = _.join(command.commandText, ' or ');
        result += `${commandText}: ${command.helpText}`;
        result += '\n';
      })
    return result;
  }

  private create<T>(model: new () => T): T {
    return new model();
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

  private generateCommandList(): Command[] {
    let results: Command[] = [];
    allCommands.forEach(x => {
      // This isn't ideal, but basically we're just trying to create a new instance
      // of the class that inherits from the Command interface
      let command = this.create(x as any) as Command;
      results.push(command);
    })
    return results;
  }
}