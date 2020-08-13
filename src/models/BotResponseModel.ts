import { GroupmeAttachmentModel } from "./Groupme/GroupmeAttachmentModel";

export class BotResponseModel {
  public text: string;
  public attachments: GroupmeAttachmentModel[];

  public bot_id: string;

  constructor(text: string, attachments: GroupmeAttachmentModel[]) {
    this.bot_id = process.env.BOT_ID;
    this.text = text;
    this.attachments = attachments;
  }
}