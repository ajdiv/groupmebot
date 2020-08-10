import { AwardsCommand } from "../models/awardsCommand"
import { Command } from "../models/command"
import { CoolGuyCommand } from "../models/coolGuyCommand"
import { HelpCommand } from "../models/helpCommand"
import { HereCommand } from "../models/hereCommand"
import { SpewCommand } from "../models/spewCommand"
import { ThesaurizeCommand } from "../models/thesaurizeCommand"
import { WednesdayCommand } from "../models/wednesdayCommand"

export default [
  AwardsCommand,
  CoolGuyCommand,
  HelpCommand,
  HereCommand,
  SpewCommand,
  ThesaurizeCommand,
  WednesdayCommand
] as unknown as Command[]