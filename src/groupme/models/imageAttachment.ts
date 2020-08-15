import { AttachmentTypes } from "../constants/attachmentTypes";
import { Attachment } from "./attachment";

export class ImageAttachment implements Attachment {
  public type: AttachmentTypes = AttachmentTypes.Image;

  public url: string;

  constructor(url: string) {
    this.url = url;
  }
}