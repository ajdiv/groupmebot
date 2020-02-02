import { AttachmentTypes } from "../../models/AttachmentOptions";
import { BotResponseAttachmentModel, BotResponseModel } from "../../models/BotResponseModel";
import { Command } from "../../models/CommandModel";

import GroupMeService = require('../gmeSvc');

export class HereCommand implements Command {

  private currentLocusIndex: number;
  private lociArray: [number, number][];
  private responseText: string;
  private userIds: number[];

  constructor() {
    this.responseText = ''; // We can add any intro text here if we want to in the future
    this.currentLocusIndex = this.responseText.length;
    this.userIds = [];
    this.lociArray = [];
  }

  // Tagging everyone requires the bot to receive an "attachment" object along w/ its Post request
  // Loci is an array of [x,y], where x is the starting location of the text, and y is the @+name.length of the member's name
  // Result should be formatted as below:
  //[
  //   {
  //     "loci": [
  //       [
  //         10,
  //         8
  //       ]
  //     ],
  //     "type": "mentions",
  //     "user_ids": [
  //       "12345678"
  //     ]
  //   }
  // ]
  async execute(): Promise<BotResponseModel> {
    const allGroupMembers = await GroupMeService.getAllUsersInCurrentGroup();
    this.buildTagProperties(allGroupMembers);
    const result = new BotResponseModel(
      this.responseText,
      [
        new BotResponseAttachmentModel(
          AttachmentTypes.Mentions,
          this.userIds,
          this.lociArray
        )
      ]
    )
    return result;
  }

  private buildTagProperties(allGroupMembers: any[]): void {
    for (var i = 0; i < allGroupMembers.length; i++) {
      const userId = allGroupMembers[i].user_id
      const name = allGroupMembers[i].nickname;
      const locus: [number, number] = [this.currentLocusIndex, name.length + 1]; //name.length + 1 to account for the "@"
      if (i === 0) {
        this.responseText += '@' + name;
      } else {
        this.responseText += ' @' + name;
      }
      this.currentLocusIndex = this.responseText.length + 1; //to account for the space
      this.userIds.push(userId);
      this.lociArray.push(locus);
    }
  };
}