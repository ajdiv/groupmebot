import { AttachmentTypes } from "./AttachmentOptions";

export class BotResponseModel {
  text?: string;
  attachments?: BotResponseAttachmentModel[];

  constructor(text?: string, attachments?: BotResponseAttachmentModel[]) {
    this.text = text;
    this.attachments = attachments;
  }
}

export class BotResponseAttachmentModel {
  type: AttachmentTypes;
  userIds: number[];
  lociArr: [number, number][];

  constructor(type: AttachmentTypes, userIds: number[], lociArr: [number, number][]) {
    this.type = type;
    this.userIds = userIds;
    this.lociArr = lociArr;
  }
}