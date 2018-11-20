var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var coolGuyRegex = /^\/cool guy$/;
  var thesaurusRegex = /^\/thesaurize$/;

  var response = this.res;

  if(request.text && coolGuyRegex.test(request.text)) {
    this.res.writeHead(200);
    postCoolGuyMessage(function(results) {
      response.end(results);
    });
  } else if (request.text && thesaurusRegex.test(request.text)){
    this.res.writeHead(200);
    postThesaurizeMessage(function(results){
      response.end(results);
    });
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postCoolGuyMessage(callback) {
  var botResponse, options, body, botReq;

  botResponse = cool() + 'COOL';

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  var results = JSON.stringify(body);
  botReq.end(results);
  return callback(results);
}

function postThesaurizeMessage(callback) {
  var botResponse, options, body, botReq;

  botResponse =  cool() + 'THESAURUS';

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
  var results = JSON.stringify(body);
  botReq.end(results);
  return callback(results);
}


exports.respond = respond;