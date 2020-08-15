import _ from 'lodash';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { GroupmeTool } from '../groupme/groupmeTool';
import { Message } from '../groupme/models/message';
import { UserStatsModel } from '../models/UserStatsModel';
import { DateUtilities } from '../utilities/dateUtilities';

export abstract class AwardsTool {

  public static async getAwards(): Promise<string> {
    const time = DateUtilities.getTodayAndTomorrow();
    const begin = time[0];
    const end = time[1];

    //Get last messages until we hit the beginning time
    let keepLooping = true;
    let beforeId = null;
    let userStatsArr: UserStatsModel[] = [];
    while (keepLooping) {
      let messages = await GroupmeTool.getMessages(100, beforeId, null) as Message[];
      messages = _.filter(messages, x => x.sender_type != SenderTypes.Bot);
      _.each(messages, message => {
        if (message.created_at_date <= begin) {
          keepLooping = false;
          return false; //break
        }
        let user = _.find(userStatsArr, x => x.user_id === message.user_id);
        if (!user) {
          user = new UserStatsModel(message.user_id, message.name);
          userStatsArr.push(user);
        }
        user.messageCount++;
        user.likeCount += message.favorited_by.length;

        beforeId = message.id;
        return undefined; //continue
      });
    }

    let result = '';
    result += this.getTopMessages(userStatsArr);
    result += '\n';
    result += '\n';
    result += this.getMostLikeable(userStatsArr);
    return result;
  }

  private static getTopMessages(userStatsArr: UserStatsModel[]): string {

    let topMessageString = "Most Messages Sent:\n    ";
    let topMessageResultArr: string[] = [];
    const topMessages = _.sortBy(userStatsArr, x => x.messageCount).reverse();
    _.each(topMessages, stats => {
      topMessageResultArr.push(stats.nickname + " (" + stats.messageCount + ")");
    });

    for (var i = 0; i < topMessageResultArr.length; i++) {
      topMessageString += topMessageResultArr[i];
      // If we are at the end of the array, don't add dots
      if (i != topMessageResultArr.length - 1) {
        topMessageString += "\n    ";
      }
    }
    return topMessageString;
  }

  private static getMostLikeable(userStatsArr: UserStatsModel[]): string {

    let likeableString = "Most Likeable:\n    ";
    let likeableResultArr: string[] = [];
    const likeableUsers = _.sortBy(userStatsArr, x => x.likeCount / x.messageCount).reverse();
    _.each(likeableUsers, stats => {
      likeableResultArr.push(`${stats.nickname} (${stats.likeCount} like${stats.likeCount === 1 ? '' : 's'} in ${stats.messageCount} message${stats.messageCount === 1 ? '' : 's'})`);
    });

    for (var i = 0; i < likeableResultArr.length; i++) {
      likeableString += likeableResultArr[i];
      // If we are at the end of the array, don't add dots
      if (i != likeableResultArr.length - 1) {
        likeableString += "\n    ";
      }
    }
    return likeableString;
  }
}


