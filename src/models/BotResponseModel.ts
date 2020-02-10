import { GroupmeAttachmentModel } from "./Groupme/GroupmeAttachmentModel";

export class BotResponseModel {
  text: string;
  attachments: GroupmeAttachmentModel[];

  bot_id: string;

  constructor(text: string, attachments: GroupmeAttachmentModel[]) {
    this.bot_id = process.env.BOT_ID;
    this.text = text;
    this.attachments = attachments;
  }
}