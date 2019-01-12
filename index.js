var http, director, cool, bot, router, server, port;

http        = require('http');
https        = require('https');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./services/botSvc.js');
thesaurus   = require('./services/thesaurusSvc');
gme         = require('./services/gmeSvc');

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({path:'config/env'});
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
    var testStr = "Joe Addamo is my best friend";
    result += testStr;
    result += '\n\n';
    thesaurus.thesaurize(testStr, function(res) {
      result += (JSON.stringify(res));
      response.end(result);
    });
  });
}