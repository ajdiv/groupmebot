import HTTPS = require('https');
import cool = require('cool-ascii-faces');
import thesaurus = require('./thesaurusSvc');
import gme = require('./gmeSvc');
import awardsSvc = require('./awardSvc');


// Hard-coded botId is the Test Dev GroupMe bot
var options = getRequestOptions();
function respond(request, response) {
  var request = request.body;
  var coolGuyRegex = /^\/cool guy$/;
  var thesaurusRegex = /^\/thesaurize$/;
  var hereRegex = /@here$/;
  var spew = /^\/spew$/;
  var awardsRegex = /^\/awards$/;

  if (!request.text || request.text.length === 0) {
    var botResponse = (JSON.stringify(request));
    response.writeHead(200);
    postBotResults(botResponse, null);
    response.end();
  }
  logMessage(request).then(res => {
    // TODO: This needs to move to a factory service
    // TODO: Move these to promises
    if (request.user_id && spew.test(request.text)) {
      response.writeHead(200);
      addSpew(request.user_id, function (results) {
        response.end(results);
      });
    } else if (request.text && coolGuyRegex.test(request.text)) {
      response.writeHead(200);
      postCoolGuyMessage(function (results) {
        response.end(results);
      });
    } else if (request.text && thesaurusRegex.test(request.text)) {
      response.writeHead(200);
      postThesaurizeMessage(function (results) {
        response.end(results);
      });
    } else if (request.text && hereRegex.test(request.text)) {
      response.writeHead(200);
      tagEveryone(function (results) {
        response.end(results);
      });
    } else if (request.text && awardsRegex.test(request.text)) {
      response.writeHead(200);
      getAwards(request.group_id, function (results) {
        response.end(results);
      });
    } else {
      console.log("don't care");
      response.writeHead(200);
      response.end();
    }
  });
}

function logMessage(request): Promise<any> {
  if (request.text) {
    request.text = request.text.trim();
    if (request.user_id && request.group_id) {
      return awardsSvc.addMsgCounter(request.user_id, request.group_id);
    }
  }
  return Promise.resolve();
}

function postCoolGuyMessage(callback) {
  var botResponse = cool();
  postBotResults(botResponse, null);
  return callback(botResponse);
}

function postThesaurizeMessage(callback) {
  gme.getLastMessageText(function (res) {
    thesaurus.thesaurize(res, function (res) {
      var botResponse = (JSON.stringify(res));
      postBotResults(botResponse, null);
      return callback(botResponse);
    });
  });
};

function addSpew(userId, callback) {
  gme.addSpew(userId, function (res) {
    var botResponse = (JSON.stringify(res));
    postBotResults(botResponse, null);
    return callback(botResponse);
  });
};

function tagEveryone(callback) {
  var botText = ""; //Maybe handle space elsewhere but leave at end for now
  //var botText = "Tagging everyone "; //Maybe handle space elsewhere but leave at end for now
  gme.tagEveryone(botText, function (res) {
    var botResponse = (JSON.stringify(res));
    postBotResults(res.text, res.attachments);
    return callback(botResponse);
  });
};

function getAwards(groupId, callback) {
  // Get all users in group
  return gme.getAllUsersInCurrentGroup().then(members => {
    return awardsSvc.getAwards(groupId, members).then(res => {
      var botResponse = (JSON.stringify(res));
      postBotResults(botResponse, null);
      return callback(botResponse);
    })
  });
};

function getRequestOptions() {
  return {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };
};

function getBotBody(botResponse, attachments) {
  var botID = process.env.BOT_ID;
  return {
    "bot_id": botID,
    "text": botResponse,
    "attachments": attachments
  };
};

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

function configureBotReqObj(botReq) {
  botReq.on('error', function (err) {
    console.log('error posting message ' + JSON.stringify(err));
  });
  botReq.on('timeout', function (err) {
    console.log('timeout posting message ' + JSON.stringify(err));
  });
}

function postBotResults(botResponse, attachmentsArr) {
  var botID = process.env.BOT_ID;
  var body = getBotBody(botResponse, attachmentsArr);
  var botReq = getBotReqObj();
  console.log('sending ' + botResponse + ' to ' + botID);
  var results = JSON.stringify(body);
  botReq.end(results);
};

export = {
  respond: respond
}