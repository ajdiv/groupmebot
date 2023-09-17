import { BotResponseModel } from "../../models/BotResponseModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

export class SiteCommand implements Command {

  commandText = ['/site', '/website', '/url'];
  commandCheckLocation = CommandCheckLocation.Start;
  helpText = 'boyz homepage';

  constructor() { }

  async execute(): Promise<BotResponseModel> {
    const url = process.env.SITE_URL
    const result = new BotResponseModel(url, null);
    return result;
  }
}