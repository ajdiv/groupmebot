import { GroupmeUserRoles } from "./GroupmeUserRoles";

export class GroupmeUserModel {

  public user_id: string;
  public nickname: string;
  public image_url: string;
  public id: string;
  public muted: boolean;
  public roles: GroupmeUserRoles[];
  public name: string;

  constructor() { }

}