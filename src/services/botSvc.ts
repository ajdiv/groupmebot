import HTTPS = require('https');
import express = require('express');
import { ClientRequest } from 'http';
import { injectable } from 'inversify';
import { CommandList } from '../commands/commandFactory';
import { SenderType } from '../constants/GroupmeSenderType';
import { BotResponseModel } from '../models/BotResponseModel';
import GroupmeMessageModel from '../models/Groupme/GroupmeMessageModel';

@injectable()
export default class BotSvc {

  constructor() { }

  async respond(reqBody: GroupmeMessageModel, response: express.Response): Promise<void> {
    if (reqBody.sender_type === SenderType.Bot) return Promise.resolve();
    if (reqBody.text) reqBody.text = reqBody.text.trim().toLowerCase();

    let responseMsg: string;
    response.writeHead(200);
    const commandList = new CommandList();
    const command = commandList.getCommand(reqBody.text);
    //const command = CommandFactory.getCommand(reqBody);
    if (command) {
      const results = await command.execute(reqBody);
      responseMsg = results.text;
      this.sendBotResponse(results);
    }

    response.end(responseMsg);
  }

  private sendBotResponse(responseModel: BotResponseModel) {
    const reqOptions: HTTPS.RequestOptions = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };

    const clientReq = HTTPS.request(reqOptions);
    this.addRequestErrorHandlers(clientReq);
    console.log(`This is what I'm sending back: "${responseModel.text}"`);
    clientReq.end(JSON.stringify(responseModel));
  };

  private addRequestErrorHandlers(clientReq: ClientRequest) {
    clientReq.on('error', function (err: any) {
      console.log('error posting message ' + JSON.stringify(err));
    });
    clientReq.on('timeout', function (err: any) {
      console.log('timeout posting message ' + JSON.stringify(err));
    });
  }
}

