var HTTPS = require('https');
var cool = require('cool-ascii-faces');
thesaurus = require('./thesaurusSvc');
gme = require('./gmeSvc');

// Hard-coded botId is the Test Dev GroupMe bot
var options = getRequestOptions();

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var coolGuyRegex = /^\/cool guy$/;
  var thesaurusRegex = /^\/thesaurize$/;
  var hereRegex = /@here$/;
  var spew = /^\/spew$/;

  var response = this.res;
  if(request.text){
    request.text = request.text.trim();
  }

  if (request.user_id && spew.test(request.text)) {
    this.res.writeHead(200);
    addSpew(request.user_id, function (results) {
      response.end(results);
    });
  }

  if (request.text && coolGuyRegex.test(request.text)) {
    this.res.writeHead(200);
    postCoolGuyMessage(function (results) {
      response.end(results);
    });
  } else if (request.text && thesaurusRegex.test(request.text)) {
    this.res.writeHead(200);
    postThesaurizeMessage(function (results) {
      response.end(results);
    });
  } else if (request.text && hereRegex.test(request.text)) {
    this.res.writeHead(200);
    tagEveryone(function (results) {
      response.end(results);
    });
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postCoolGuyMessage(callback) {
  var botResponse = cool();
  postBotResults(botResponse);
  return callback(botResponse);
}

function postThesaurizeMessage(callback) {
  gme.getLastMessageText(function (res) {
    thesaurus.thesaurize(res, function (res) {
      var botResponse = (JSON.stringify(res));
      postBotResults(botResponse);
      return callback(botResponse);
    });
  });
};

function addSpew(userId, callback) {
  gme.addSpew(userId, function (res) {    
    var botResponse = (JSON.stringify(res));
    postBotResults(botResponse);
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
  body = getBotBody(botResponse, attachmentsArr);
  botReq = getBotReqObj();
  console.log('sending ' + botResponse + ' to ' + botID);
  var results = JSON.stringify(body);
  botReq.end(results);
};

exports.respond = respond;