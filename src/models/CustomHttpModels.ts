export class RequestBodyModel{
  text?: string;
  user_id?: number;
  group_id?: number;

  constructor(text?: string, user_id?: string, group_id?: string){
    this.text = text;
    this.user_id = parseInt(user_id) || null;
    this.group_id = parseInt(group_id) || null;
  }
}