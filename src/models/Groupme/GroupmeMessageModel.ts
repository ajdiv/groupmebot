import { SenderType } from "../../constants/GroupmeSenderType";
import { GroupmeAttachmentModel } from "./GroupmeAttachmentModel";

export class GroupmeMessageModel {
  /** This is the unix time format as provided by GroupMe. Use created_at_date instead */
  private created_at: number;

  public attachments: GroupmeAttachmentModel[];
  public avatar_url: string;
  public favorited_by: number[];
  public group_id: number;
  public id: string;
  public name: string;
  public sender_id: string;
  public sender_type: SenderType;
  public source_guid: string;
  public system: boolean;
  public text: string;
  public user_id: string

  public get created_at_date(): Date {
    return new Date(this.created_at * 1000);
  };

  public set created_at_date(dateObj: Date) {
    this.created_at = dateObj.getTime() / 1000;
  };

  constructor() { }

}