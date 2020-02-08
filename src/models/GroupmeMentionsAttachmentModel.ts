import { GroupmeAttachmentModel } from "./GroupmeAttachmentModel";
import { GroupmeAttachmentType } from "./GroupmeAttachmentType";

export class GroupmeMentionsAttachmentModel implements GroupmeAttachmentModel {
  public type: GroupmeAttachmentType = GroupmeAttachmentType.Mentions;

  public loci: [number, number][];
  public user_ids: number[];

  constructor(loci: [number, number][], user_ids: number[]) {
    this.loci = loci;
    this.user_ids = user_ids;
  }
}