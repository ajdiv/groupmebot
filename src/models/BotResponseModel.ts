export class BotResponseModel{
  text?: string;
  attachments?: BotResponseAttachmentModel[];

  constructor(text?: string, attachments?: BotResponseAttachmentModel[]){
    this.text = text;
    this.attachments = attachments;
  }
}

export class BotResponseAttachmentModel{
  type: string;
  userIds: number[];
  lociArr: [number, number][];

  constructor(type: string, userIds: number[], lociArr: [number, number][]){
    this.type = type;
    this.userIds = userIds;
    this.lociArr = lociArr;
  }
}