var http, director, cool, bot, router, server, port;

http = require('http');
https = require('https');
director = require('director');

cool = require('cool-ascii-faces');
bot = require('./services/botSvc.js');
thesaurus = require('./services/thesaurusSvc');
gme = require('./services/gmeSvc');

mongoose = require('mongoose');

User = require('./models/user.model');
Spew = require('./models/spew.model');

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: 'config/env' });
}

let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router = new director.http.Router({
  '/': {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function (err) {
    res.writeHead(err.status, { "Content-Type": "text/plain" });
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  var response = this.res;
  response.writeHead(200);

  var gmeId = 2; //TEST ONLY
  Spew.findOne({ gmeUserId: gmeId }).then(result => {
    if (!result) {
      let spew = new Spew({
        gmeUserId: gmeId,
        spewCount: 1,
        spewDate: new Date()
      });
      return spew.save().then(res => {
        return response.end(`Created new user with id ${res.gmeUserId}`);
      });
    } else {
      result.spewCount++;
      return result.save().then((res) => {
          return response.end(`Updated user with Spew Count: ${result.spewCount}`);
        });
    }
  });

  // let user = new User({
  //   gmeUserId: 1,
  //   gmeGroupId: 2,
  // });

  // user.save(function (err) {
  //   if (err) {
  //       return next(err);
  //   }
  //   response.end("Created test user");
  // });

  // gme.getLastMessageText(function(res){
  //   var result = res;
  //   result += '\n\n';
  //   var testStr = "Joe Addamo is my best friend";
  //   result += testStr;
  //   result += '\n\n';
  //   thesaurus.thesaurize(testStr, function(res) {
  //     result += (JSON.stringify(res));
  //     response.end(result);
  //   });
  // });
}