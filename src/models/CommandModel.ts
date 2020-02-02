import { RequestBodyModel } from "../models/CustomHttpModels";
import { BotResponseModel } from "./BotResponseModel";

export interface Command {
  execute(botRequestBody: RequestBodyModel): Promise<BotResponseModel>;
}