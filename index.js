var http, director, cool, bot, router, server, port;

http        = require('http');
https        = require('https');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');
thesaurus   = require('./thesaurusSvc');
gme         = require('./gmeSvc');
var request = require('request');

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  var response = this.res;
  response.writeHead(200);  

  gme.getLastMessageText(function(res){
    var result = res;
    result += '\n\n';
    var testStr = "new test for deployment";
    result += testStr;
    result += '\n\n';
    thesaurus.thesaurize(testStr, function(res) {
      result += (JSON.stringify(res));
      response.end(result);
    });
  });
}