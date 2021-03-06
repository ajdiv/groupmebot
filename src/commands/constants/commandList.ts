import { AwardsCommand } from "../models/awardsCommand"
import { CoolGuyCommand } from "../models/coolGuyCommand"
import { HelpCommand } from "../models/helpCommand"
import { HereCommand } from "../models/hereCommand"
import { SpewCommand } from "../models/spewCommand"
import { ThesaurizeCommand } from "../models/thesaurizeCommand"
import { WednesdayCommand } from "../models/wednesdayCommand"

export class CommandList{
  public static readonly allCommands = [
    AwardsCommand,
    CoolGuyCommand,
    HelpCommand,
    HereCommand,
    SpewCommand,
    ThesaurizeCommand,
    WednesdayCommand
  ];
}