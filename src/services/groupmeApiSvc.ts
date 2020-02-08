import request = require('request-promise');
import _ = require("lodash");
import { GroupmeGroupModel } from '../models/GroupmeGroupModel';
import { GroupmeMessageModel } from '../models/GroupmeMessageModel';

async function getCurrentGroup(): Promise<GroupmeGroupModel> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}?token=${process.env.ACCESS_TOKEN}`;
  const results = await makeRequest(url);
  const group: GroupmeGroupModel = Object.assign(new GroupmeGroupModel(), results);
  return group;
}

/**
 * @param limit Limits the number of recent messages. Must be between 1 and 100
 */
async function getMessages(limit: number): Promise<GroupmeMessageModel[]> {
  if (!limit || limit > 100) return Promise.reject('Limit must be between 1 and 100');

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/messages?limit=${limit}&token=${process.env.ACCESS_TOKEN}`;
  const results = await makeRequest(url);
  const messages: GroupmeMessageModel[] = _.map(results.messages, x => Object.assign(new GroupmeMessageModel(), x));
  return messages;
}

function getBaseUrl(): string {
  const groupId = process.env.GROUP_ID;
  return `https://api.groupme.com/v3/groups/${groupId}`;
}

async function makeRequest(url: string): Promise<any> {
  try {
    const stringResults: string = await request(url);
    const jsonResults = JSON.parse(stringResults);
    return jsonResults.response;
  }
  catch (error) {
    return Promise.reject(error.code + ": An error has occurred connecting to the GroupMe API.");
  }
}

export = {
  getCurrentGroup,
  getMessages
}