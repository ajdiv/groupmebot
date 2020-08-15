import { Attachment } from "../groupme/models/attachment";

export class BotResponse {

  // Do not change the names of any of these properties
  // This is sent as the body of a POST request that is directly parsed by GroupMe servers
  public text: string;
  public attachments: Attachment[];
  public readonly bot_id: string = process.env.BOT_ID;

  constructor(text: string, attachments: Attachment[] = null) {
    this.text = text;
    this.attachments = attachments;
  }
}