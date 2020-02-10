import request = require('request-promise');
import _ = require("lodash");
import { GroupmeGroupModel } from '../models/Groupme/GroupmeGroupModel';
import { GroupmeMessageModel } from '../models/Groupme/GroupmeMessageModel';
import qs = require('querystring');

async function getCurrentGroup(): Promise<GroupmeGroupModel> {
  const results = await get(null, null);
  const group: GroupmeGroupModel = Object.assign(new GroupmeGroupModel(), results);
  return group;
}

/**
 * @param limit Limits the number of recent messages. Must be between 1 and 100
 */
async function getMessages(limit: number, before_id: string, after_id: string): Promise<GroupmeMessageModel[]> {
  if (!limit || limit > 100) return Promise.reject('Limit must be between 1 and 100');

  const path = `messages`;
  const options = Object.assign({},
    limit ? { limit } : null,
    before_id ? { before_id } : null,
    after_id ? after_id : null
  );

  const results = await get(path, options);
  const messages: GroupmeMessageModel[] = _.map(results.messages, x => Object.assign(new GroupmeMessageModel(), x));
  return messages;
}

/**
 * @param path This is the part of the URL that is after groupme.com/v3/groups/groupId/
 */
async function get(path: string, queryParams: any): Promise<any> {
  const baseUrl = getBaseUrl();
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

function getBaseUrl(): string {
  const groupId = process.env.GROUP_ID;
  return `https://api.groupme.com/v3/groups/${groupId}`;
}

export = {
  getCurrentGroup,
  getMessages
}