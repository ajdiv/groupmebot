import { BotResponseModel } from "./BotResponseModel";
import { GroupmeMessageModel } from "./GroupmeMessageModel";

export interface Command {
  execute(botRequestBody: GroupmeMessageModel): Promise<BotResponseModel>;
}