import { UserRoles } from "../constants/userRoles";

export class User {

  public user_id: string;
  public nickname: string;
  public image_url: string;
  public id: string;
  public muted: boolean;
  public roles: UserRoles[];
  public name: string;

  constructor() { }

}