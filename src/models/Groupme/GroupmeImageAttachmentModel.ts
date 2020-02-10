import { GroupmeAttachmentType } from "../../constants/GroupmeAttachmentType";
import { GroupmeAttachmentModel } from "./GroupmeAttachmentModel";

export class GroupmeImageAttachmentModel implements GroupmeAttachmentModel {
  public type: GroupmeAttachmentType = GroupmeAttachmentType.Image;

  public url: string;

  constructor(url: string) {
    this.url = url;
  }
}