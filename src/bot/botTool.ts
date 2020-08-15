import { Response } from 'express';
import { ClientRequest } from 'http';
import { request, RequestOptions } from 'https';
import { CommandFactory } from '../commands/commandFactory';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { Message } from '../groupme/models/message';
import { BotResponse } from './botResponse';

export class BotTool {

  private static readonly GROUPME_HOSTNAME: string = 'api.groupme.com';
  private static readonly GROUPME_PATH: string = '/v3/bots/post';

  static async readMessageAndRespond(reqBody: Message, response: Response): Promise<void> {
    if (reqBody.sender_type === SenderTypes.Bot || !reqBody.text) {
      response.writeHead(200);
      response.end('Not responding to nonsense');
      return Promise.resolve(); // Don't respond to other bots or empty images
    }

    let cleanText = reqBody.text.trim().toLowerCase();
    const command = CommandFactory.getCommand(cleanText);

    if (!command) {
      response.end('No command found');
      return;
    }

    let results: BotResponse;
    let responseMsg: string;

    try {
      results = await command.execute(reqBody);
      response.writeHead(200);
      responseMsg = results.text;
    }
    catch (error) {
      responseMsg = `Error executing: ${cleanText}`;
      response.writeHead(500, responseMsg);
      results = new BotResponse(responseMsg);
      console.log(error);
    }

    this.sendBotResponse(results);
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

  private static sendBotResponse(responseModel: BotResponse) {
    const reqOptions: RequestOptions = {
      hostname: this.GROUPME_HOSTNAME,
      path: this.GROUPME_PATH,
      method: 'POST'
    };

    const clientReq = request(reqOptions, (res) => {
      let hi = 2;
    });

    clientReq.on('error', (err) => {

      let hi = 2;
    })

    this.addRequestErrorHandlers(clientReq);
    console.log(`Sending: "${responseModel.text}"`);
    clientReq.end(JSON.stringify(responseModel));
  };
}