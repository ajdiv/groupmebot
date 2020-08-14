import { Response } from 'express';
import { ClientRequest } from 'http';
import { request, RequestOptions } from 'https';
import { CommandFactory } from '../commands/commandFactory';
import { SenderType } from '../constants/GroupmeSenderType';
import { GroupmeMessageModel } from '../models/Groupme/GroupmeMessageModel';
import { BotResponseModel } from './models/botResponseModel';

export class BotTool {

  private static readonly GROUPME_HOSTNAME: string = 'api.groupme.com';
  private static readonly GROUPME_PATH: string = '/v3/bots/post';

  static async respond(reqBody: GroupmeMessageModel, response: Response): Promise<void> {
    if (reqBody.sender_type === SenderType.Bot || !reqBody.text) {
      response.writeHead(200);
      response.end('Not responding to nonsense');
      return Promise.resolve(); // Don't respond to other bots or empty images
    }

    let responseMsg: string;
    let cleanText = reqBody.text.trim().toLowerCase();
    const command = CommandFactory.getCommand(cleanText);
    if (command) {
      try {
        const results = await command.execute(reqBody);
        response.writeHead(200);
        responseMsg = results.text;
        this.sendBotResponse(results);
      }
      catch{
        response.writeHead(500);
        responseMsg = `Error executing: ${cleanText}`;
      }
    } else {
      responseMsg = 'No command found';
    }

    response.end(responseMsg);
  }

  private static addRequestErrorHandlers(clientReq: ClientRequest) {
    clientReq.on('error', function (err: any) {
      console.log('error posting message ' + JSON.stringify(err));
    });
    clientReq.on('timeout', function (err: any) {
      console.log('timeout posting message ' + JSON.stringify(err));
    });
  }

  private static sendBotResponse(responseModel: BotResponseModel) {
    const reqOptions: RequestOptions = {
      hostname: this.GROUPME_HOSTNAME,
      path: this.GROUPME_PATH,
      method: 'POST'
    };

    const clientReq = request(reqOptions);
    this.addRequestErrorHandlers(clientReq);
    console.log(`Sending: "${responseModel.text}"`);
    clientReq.end(JSON.stringify(responseModel));
  };
}