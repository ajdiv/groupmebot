import { request, RequestOptions } from 'https';
import { CommandFactory } from '../commands/commandFactory';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { Message } from '../groupme/models/message';
import { BotResponse } from './botResponse';


export abstract class BotTool {

  private static readonly GROUPME_HOSTNAME: string = 'api.groupme.com';
  private static readonly GROUPME_PATH: string = '/v3/bots/post';

  static async readMessageAndRespond(reqBody: Message): Promise<string> {
    // Don't respond to other bots or empty images
    if (reqBody.sender_type === SenderTypes.Bot || !reqBody.text) return 'No text to read';

    let cleanText = reqBody.text.trim().toLowerCase();
    const command = CommandFactory.getCommand(cleanText);
    if (!command) return 'No command found';

    let results: BotResponse;
    let responseMsg: string;

    try {
      results = await command.execute(reqBody);
      responseMsg = results.text;
    }
    catch (error) {
      responseMsg = `Error executing: ${cleanText}`;
      results = new BotResponse(responseMsg);
      console.log(error);
    }

    this.sendBotResponse(results);
    return responseMsg;
  }

  private static sendBotResponse(responseModel: BotResponse) {
    const reqOptions: RequestOptions = {
      hostname: this.GROUPME_HOSTNAME,
      path: this.GROUPME_PATH,
      method: 'POST'
    };

    const clientReq = request(reqOptions);

    clientReq.on('error', (err: any) => {
      console.log('Error posting message to GroupMe: ' + JSON.stringify(err));
    });
    clientReq.on('timeout', function (err: any) {
      console.log('Timeout posting message to GroupMe: ' + JSON.stringify(err));
    });

    clientReq.end(JSON.stringify(responseModel));
  };
}