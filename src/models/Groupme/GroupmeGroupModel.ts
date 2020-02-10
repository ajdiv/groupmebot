import { GroupmeUserModel } from "./GroupmeUserModel";
import _ = require("lodash");

export class GroupmeGroupModel {
  /** This is the unix time format as provided by GroupMe. Use created_at_date instead */
  private created_at: number;
  /** This is the unix time format as provided by GroupMe. Use updated_at_date instead */
  private updated_at: number;

  public id: string;
  public description: string;
  public group_id: string;
  public image_url: string;
  public members: GroupmeUserModel[];
  public name: string;
  public phone_number: string;

  public get created_at_date(): Date {
    return new Date(this.created_at * 1000);
  };

  public set created_at_date(dateObj: Date) {
    this.created_at = dateObj.getTime() / 1000;
  };

  public get updated_at_date(): Date {
    return new Date(this.updated_at * 1000);
  };

  public set updated_at_date(dateObj: Date) {
    this.updated_at = dateObj.getTime() / 1000;
  };

  constructor() { }

}