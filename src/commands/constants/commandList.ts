import { AwardsCommand } from "../models/awardsCommand"
import { CoolGuyCommand } from "../models/coolGuyCommand"
import { EventCommand } from "../models/eventCommand"
import { HelpCommand } from "../models/helpCommand"
import { HereCommand } from "../models/hereCommand"
import { SpewCommand } from "../models/spewCommand"
import { ThesaurizeCommand } from "../models/thesaurizeCommand"
import { WednesdayCommand } from "../models/wednesdayCommand"

export class CommandList{
  public static readonly allCommands = [
    AwardsCommand,
    CoolGuyCommand,
    EventCommand,
    HelpCommand,
    HereCommand,
    SpewCommand,
    ThesaurizeCommand,
    WednesdayCommand
  ];
}