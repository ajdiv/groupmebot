import HTTPS = require('https');
import awardsSvc = require('./awardSvc');
import express = require('express');
import CommandFactory = require('./commandFactory');
import { ClientRequest } from 'http';
import { BotResponseModel } from '../models/BotResponseModel';
import { GroupmeMessageModel } from '../models/GroupmeMessageModel';
import { SenderType } from '../models/GroupmeSenderType';

async function respond(reqBody: GroupmeMessageModel, response: express.Response): Promise<void> {
  if (reqBody.text) reqBody.text = reqBody.text.trim().toLowerCase();

  await logMessage(reqBody);

  let responseMsg: string;
  response.writeHead(200);

  const command = CommandFactory.getCommand(reqBody);
  if (command) {
    const results = await command.execute(reqBody);
    responseMsg = results.text;
    sendBotResponse(results);
  }

  response.end(responseMsg);
}

function logMessage(requestBody: GroupmeMessageModel): Promise<void> {
  if (requestBody.sender_type === SenderType.User) {
    return awardsSvc.addMsgCounter(parseInt(requestBody.user_id), requestBody.group_id);
  } else {
    // It's a bot - let's not record this message
    return Promise.resolve();
  }
}

function sendBotResponse(responseModel: BotResponseModel) {
  const reqOptions: HTTPS.RequestOptions = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const clientReq = HTTPS.request(reqOptions);
  addRequestErrorHandlers(clientReq);
  console.log(`This is what I'm sending back: "${responseModel.text}"`);
  clientReq.end(JSON.stringify(responseModel));
};

function addRequestErrorHandlers(clientReq: ClientRequest) {
  clientReq.on('error', function (err: any) {
    console.log('error posting message ' + JSON.stringify(err));
  });
  clientReq.on('timeout', function (err: any) {
    console.log('timeout posting message ' + JSON.stringify(err));
  });
}

export = {
  respond: respond
}