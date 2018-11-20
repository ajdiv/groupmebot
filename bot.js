var HTTPS = require('https');
var cool = require('cool-ascii-faces');

// Hard-coded botId is the Test Dev GroupMe bot
var botID = process.env.BOT_ID || '6cc97c95a3c1d4340ea13bbc00';
var options = getRequestOptions();

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var coolGuyRegex = /^\/cool guy$/;
  var thesaurusRegex = /^\/thesaurize$/;

  var response = this.res;

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
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postCoolGuyMessage(callback) {
  var botResponse = cool() + 'COOL';
  postBotResults(botResponse);
  return callback(botResponse);
}

function postThesaurizeMessage(callback) {
  var botResponse = cool() + 'THESAURUS';
  postBotResults(botResponse);
  return callback(botResponse);
};

function getRequestOptions() {
  return {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };
};

function getBotBody(botResponse) {
  return {
    "bot_id": botID,
    "text": botResponse
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

function postBotResults(botResponse) {
  body = getBotBody(botResponse);
  botReq = getBotReqObj();
  console.log('sending ' + botResponse + ' to ' + botID);
  var results = JSON.stringify(body);
  botReq.end(results);
};
exports.respond = respond;