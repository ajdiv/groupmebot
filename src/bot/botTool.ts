import axios from 'axios';
import { CommandFactory } from '../commands/commandFactory';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { Message } from '../groupme/models/message';
import { BotResponse } from './botResponse';


export abstract class BotTool {

  private static readonly GROUPME_HOSTNAME: string = 'https://api.groupme.com';
  private static readonly GROUPME_PATH: string = '/v3/bots/post';

  static async readMessageAndRespond(reqBody: Message): Promise<string> {
    // Don't respond to other bots or empty images
    if (!reqBody || reqBody.sender_type === SenderTypes.Bot || !reqBody.text) return 'No text to read';

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

    await axios.post(this.GROUPME_HOSTNAME + this.GROUPME_PATH, results);

    return responseMsg;
  }
}