import HTTPS = require('https');
import express = require('express');
import awardsSvc = require('./awardSvc');
import CustomHttpModels = require('../models/CustomHttpModels');
import CommandExecutor = require('../factories/commandExecutor');
import { BotResponseAttachmentModel, BotResponseModel } from '../models/BotResponseModel';

var options = getRequestOptions();

async function respond(reqBody: CustomHttpModels.RequestBodyModel, response: express.Response) {
  await logMessage(reqBody);

  let responseMsg: string;
  response.writeHead(200);

  const commandResult = await CommandExecutor.executeCommand(reqBody);
  if (commandResult !== null) {
    postBotResults(commandResult);
    responseMsg = commandResult.text;
  }

  response.end(responseMsg);
}

function logMessage(requestBody: CustomHttpModels.RequestBodyModel): Promise<any> {
  if (requestBody.text) {
    requestBody.text = requestBody.text.trim().toLowerCase();
    if (requestBody.user_id && requestBody.group_id) {
      return awardsSvc.addMsgCounter(requestBody.user_id, requestBody.group_id);
    }
  }
  return Promise.resolve();
}

function getRequestOptions() {
  return {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };
};

// This is where we can probably hardcode some shit
function getBotBody(responseModel: BotResponseModel): any {
  const botID = process.env.BOT_ID;
  const text = responseModel.text;
  const attachmentObj = formatBotAttachments(responseModel.attachments);
  return {
    "bot_id": botID,
    "text": text,
    "attachments": attachmentObj
  };
};

function formatBotAttachments(attachmentsModel: BotResponseAttachmentModel[]): any[] {
  if(!attachmentsModel) return null;
  var resultArr: any[] = [];
  for (let i = 0; i < attachmentsModel.length; i++){
    let attachment = attachmentsModel[i];
    resultArr.push({
      "type": attachment.type,
      "user_ids": attachment.userIds,
      "loci": attachment.lociArr
    })
  }
  return resultArr;
}

function getBotReqObj() {
  var botReq = HTTPS.request(options, function (res) {
    if (res.statusCode == 202) {
      //neat
    } else {
      console.log('rejecting bad status code ' + res.statusCode);
    }
  });
  configureBotReqObj(botReq);
  return botReq;
};

function configureBotReqObj(botReq: any) {
  botReq.on('error', function (err: any) {
    console.log('error posting message ' + JSON.stringify(err));
  });
  botReq.on('timeout', function (err: any) {
    console.log('timeout posting message ' + JSON.stringify(err));
  });
}

// function postBotResults(botResponse, attachmentsArr) {
//   var botID = process.env.BOT_ID;
//   var body = getBotBody(botResponse, attachmentsArr);
//   var botReq = getBotReqObj();
//   console.log('sending ' + botResponse + ' to ' + botID);
//   var results = JSON.stringify(body);
//   botReq.end(results);
// };

function postBotResults(responseModel: BotResponseModel) {
  var botID = process.env.BOT_ID;
  var body = getBotBody(responseModel);
  var botReq = getBotReqObj();
  console.log('sending ' + responseModel.text + ' to ' + botID);
  var results = JSON.stringify(body);
  botReq.end(results);
};

export = {
  respond: respond
}