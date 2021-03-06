import { BotResponseModel } from "../../models/BotResponseModel";
import { GroupmeMessageModel } from "../../models/Groupme/GroupmeMessageModel";
import { CommandCheckLocation } from "../constants/commandCheckLocation";

export interface Command {

  commandText: string[];
  commandCheckLocation: CommandCheckLocation;
  helpText: string;

  execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel>;
}