import CustomHttpModels = require('../models/CustomHttpModels');
import { BotResponseModel, BotResponseAttachmentModel } from '../models/BotResponseModel';
import gme = require('../services/gmeSvc');
import thesaurus = require('../services/thesaurusSvc');
import awardsSvc = require('../services/awardSvc');

// Can't import this guy because it doesn't have any types
const cool = require('cool-ascii-faces');

function executeCommand(reqBody: CustomHttpModels.RequestBodyModel): Promise<BotResponseModel> {
  var coolGuyRegex = /^\/cool guy$/;
  var thesaurusRegex = /^\/thesaurize$/;
  var hereRegex = /@here$/;
  var spew = /^\/spew$/;
  var awardsRegex = /^\/awards$/;

  if (reqBody.user_id && spew.test(reqBody.text)) {
    return addSpew(reqBody.user_id);
  } else if (reqBody.text && coolGuyRegex.test(reqBody.text)) {
    return postCoolGuyMessage();
  } else if (reqBody.text && thesaurusRegex.test(reqBody.text)) {
    return postThesaurizeMessage();
  } else if (reqBody.text && hereRegex.test(reqBody.text)) {
    return tagEveryone();
  } else if (reqBody.text && awardsRegex.test(reqBody.text)) {
    return getAwards(reqBody.group_id);
  } else {
    // Don't care - ignore this
    return Promise.resolve(null);
  }
};

async function addSpew(userId: number): Promise<BotResponseModel> {
  const spewMsg = await gme.addSpew(userId);
  return Promise.resolve(new BotResponseModel(spewMsg, null));
};

function postCoolGuyMessage(): Promise<BotResponseModel> {
  const coolMsg = cool();
  return Promise.resolve(new BotResponseModel(coolMsg, null));
}

async function postThesaurizeMessage(): Promise<BotResponseModel> {
  const lastText = await gme.getLastMessageText();
  const thesaurizedTxt = await thesaurus.thesaurize(lastText);
  return Promise.resolve(new BotResponseModel(thesaurizedTxt, null));
};

// Tagging everyone requires that the bot receives an "attachment" along w/ its Post request
// loci is an array of [x,y], where x is the starting location of the text, and y is the @+name.length of the member's name
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
async function tagEveryone(): Promise<BotResponseModel> {
  var botText = ""; //Maybe handle space elsewhere but leave at end for now
  //var botText = "Tagging everyone "; //Maybe handle space elsewhere but leave at end for now
  const allGroupMembers = await gme.getAllUsersInCurrentGroup();

  let lociIndex = botText.length; // This corresponds to the first "x" in the loci
  let resultText = botText;
  let userIds: number[] = [];
  let lociArray: [number, number][] = [];

  for (var i = 0; i < allGroupMembers.length; i++) {
    let member = allGroupMembers[i];
    let name = member.nickname;
    let loci: [number, number] = [lociIndex, name.length + 1] //name.length + 1 to account for the "@"
    if (i === 0) {
      resultText += '@' + name;
    } else {
      resultText += ' @' + name;
    }
    lociIndex = resultText.length + 1; //to account for the space
    userIds.push(member.user_id);
    lociArray.push(loci);
  }

  var result = new BotResponseModel(
    resultText,
    [
      new BotResponseAttachmentModel(
        "mentions",
        userIds,
        lociArray
      )
    ]
  )

  return Promise.resolve(result);
};

async function getAwards(groupId: number) {
  const allGroupMembers = await gme.getAllUsersInCurrentGroup();
  const awards = await awardsSvc.getAwards(groupId, allGroupMembers);
  return Promise.resolve(new BotResponseModel(awards, null));
};

export = {
  executeCommand: executeCommand
};