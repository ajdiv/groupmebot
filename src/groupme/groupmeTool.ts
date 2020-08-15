import _ from 'lodash';
import qs from 'qs';
import request from 'request-promise';
import Spew from '../models/Mongo/SpewModel';
import { Group } from './models/group';
import { Message } from './models/message';
import { User } from './models/user';

export abstract class GroupmeTool {

  public static async addSpew(userId: number): Promise<string> {
    const result = await Spew.findOne({ gmeUserId: userId });
    let spew;
    if (!result) {
      spew = new Spew({
        gmeUserId: userId,
        spewCount: 1,
        spewDate: new Date()
      });
    }
    else {
      spew = result;
      spew.spewCount++;
    }
    const res = await spew.save();
    var word = res.spewCount === 1 ? 'time' : 'times';
    return Promise.resolve(`You spewed ${res.spewCount} ${word}`);
  }

  public static async getAllUsersInCurrentGroup(): Promise<User[]> {
    const group = await this.getCurrentGroup();
    const members = group.members;
    return members;
  }

  public static async getLastMessageText(): Promise<string> {
    const lastMessages = await this.getMessages(2, null, null);
    const message = lastMessages[1]; // We actually take the second to last because the last message was the command itself
    return message.text;
  }

  public static async getCurrentGroup(): Promise<Group> {
    const results = await this.get(null, null);
    const group: Group = Object.assign(new Group(), results);
    return group;
  }

  /**
   * @param limit Limits the number of recent messages. Must be between 1 and 100
   */
  public static async getMessages(limit: number, before_id: string, after_id: string): Promise<Message[]> {
    if (!limit || limit > 100) return Promise.reject('Limit must be between 1 and 100');

    const path = `messages`;
    const options = Object.assign({},
      limit ? { limit } : null,
      before_id ? { before_id } : null,
      after_id ? after_id : null
    );

    const results = await this.get(path, options);
    const messages: Message[] = _.map(results.messages, x => Object.assign(new Message(), x));
    return messages;
  }

  /**
   * @param path This is the part of the URL that is after groupme.com/v3/groups/groupId/
   */
  private static async get(path: string, queryParams: any): Promise<any> {
    const baseUrl = this.getBaseUrl();
    const reqData = qs.stringify(queryParams);
    let url = path ? baseUrl + '/' + path : baseUrl;
    url = reqData ? url + '?' + reqData : url;

    const options = {
      headers: {
        'X-Access-Token': process.env.ACCESS_TOKEN,
      }
    };

    try {
      const stringResults: string = await request.get(url, options);
      const jsonResults = JSON.parse(stringResults);
      return jsonResults.response;
    }
    catch (error) {
      return Promise.reject(error + ": An error has occurred connecting to the GroupMe API.");
    }
  }

  private static getBaseUrl(): string {
    const groupId = process.env.GROUP_ID;
    return `https://api.groupme.com/v3/groups/${groupId}`;
  }

}