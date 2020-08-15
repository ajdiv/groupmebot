import { BotResponse } from "../../bot/botResponse";
import { Message } from "../../groupme/models/message";
import { CommandCheckLocation } from "../constants/commandCheckLocation";

export interface Command {

  commandText: string[];
  commandCheckLocation: CommandCheckLocation;
  helpText: string;

  execute(botRequestBody: Message): Promise<BotResponse>;
}