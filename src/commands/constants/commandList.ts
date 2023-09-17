import { AwardsCommand } from "../models/awardsCommand"
import { CoolGuyCommand } from "../models/coolGuyCommand"
import { HelpCommand } from "../models/helpCommand"
import { HereCommand } from "../models/hereCommand"
import { SiteCommand } from "../models/siteCommand"
import { SpewCommand } from "../models/spewCommand"
import { StockCommand } from "../models/stockCommand"
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
    WednesdayCommand,
    SiteCommand,
    StockCommand
  ];
}