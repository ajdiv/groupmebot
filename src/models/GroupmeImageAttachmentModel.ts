import { GroupmeAttachmentModel } from "./GroupmeAttachmentModel";
import { GroupmeAttachmentType } from "./GroupmeAttachmentType";

export class GroupmeImageAttachmentModel implements GroupmeAttachmentModel {
  public type: GroupmeAttachmentType = GroupmeAttachmentType.Image;

  public url: string;

  constructor(url: string) {
    this.url = url;
  }
}