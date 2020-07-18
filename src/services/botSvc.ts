import HTTPS = require('https');
import express = require('express');
import { ClientRequest } from 'http';
import { CommandList } from '../commands/commandFactory';
import { BotResponseModel } from '../models/BotResponseModel';
import { GroupmeMessageModel } from '../models/Groupme/GroupmeMessageModel';

async function respond(reqBody: GroupmeMessageModel, response: express.Response): Promise<void> {
  if (reqBody.text) reqBody.text = reqBody.text.trim().toLowerCase();

  let responseMsg: string;
  response.writeHead(200);

  const command = CommandList.getCommand(reqBody.text);
  //const command = CommandFactory.getCommand(reqBody);
  if (command) {
    const results = await command.execute(reqBody);
    responseMsg = results.text;
    sendBotResponse(results);
  }

  response.end(responseMsg);
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