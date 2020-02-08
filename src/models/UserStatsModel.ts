export class UserStatsModel {

  public user_id: string;
  public nickname: string;
  public messageCount: number;
  public likeCount: number;

  constructor(userId: string, nickname: string) {
    this.user_id = userId;
    this.nickname = nickname;
    this.messageCount = 0;
    this.likeCount = 0;
  }

}