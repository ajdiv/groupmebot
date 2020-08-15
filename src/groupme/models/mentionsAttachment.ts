import { AttachmentTypes } from "../constants/attachmentTypes";
import { Attachment } from "./attachment";

export class MentionsAttachment implements Attachment {
  public type: AttachmentTypes = AttachmentTypes.Mentions;

  public loci: [number, number][];
  public user_ids: number[];

  constructor(loci: [number, number][], user_ids: number[]) {
    this.loci = loci;
    this.user_ids = user_ids;
  }
}