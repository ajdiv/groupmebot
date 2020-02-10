import { BotResponseModel } from "./BotResponseModel";
import { GroupmeMessageModel } from "./Groupme/GroupmeMessageModel";

export interface Command {
  execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel>;
}