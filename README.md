
# GroupMe Chat Bot

## Description

Chatbot that responds to various commands in the GroupMe app
Written in Node.js + TypeScript
Mocha + Chai testing framework
Intended to deploy to Heroku

## Developing Locally

This application is built using Node.js. Please make sure you have node/npm installed ([how-to install node/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). After cloning/pulling from this repository, ensure you run "npm install" to stay up to date with the latest packages.

We use an env file to record different variables that are unique to each GroupMe chat - and is gitignored. We have an env.sample file (in the config folder) that you should be able to copy/paste and remove the ".sample" from. See the [Environment File](#env) section for specifics.

Testing requests can be used with Postman. All messages from GroupMe are sent as POST requests, but this API also accepts GETs as well (currently only for testing).

Here's a sample body of a GroupMe POST when sending a message:

	{
		"attachments":[],
		"avatar_url":"REDACTED",
		"created_at":1580663355,
		"group_id":"REDACTED",
		"id":"REDACTED",
		"name":"AJ",
		"sender_id":"REDACTED",
		"sender_type":"user",
		"source_guid":"REDACTED",
		"system":false,
		"text":"/help",
		"user_id":"REDACTED"
	}

Requests should have a content type of application/json and should be made to your localhost (port 5000 by default): http://127.0.0.1:5000/

Run locally by executing the following command: npm run start
Run tests by executing the following command: npm run test

## Environment File<a name="env"></a>

Any additions to this file should be recorded in this README, with instructions on how to retrieve the variable values. Here is the current environment variables, with descriptions of how to retrieve your own:

*  BOT_ID: Bot ID of your GroupMe bot. Found at [https://dev.groupme.com/bots](https://dev.groupme.com/bots). See [below](#bot) for instructions on creating the bot
* THESAURUS_API_KEY: API key corresponding to your registration at [https://words.bighugelabs.com/site/api](https://words.bighugelabs.com/site/api)
* GROUP_ID: ID of the GroupMe group. Also found at [https://dev.groupme.com/bots](https://dev.groupme.com/bots)
* ACCESS_TOKEN: The Access Token given to your specific GroupMe account. Found at [https://dev.groupme.com](https://dev.groupme.com), by clicking "Access Token" on the top right of the nav. This is an extremely sensitive token - please be careful where you're sharing this, as this token can have people post messages on your behalf
* MONGODB_URI: Connection string for Mongo DB to use. We use mLab as a lightweight DB for any custom data storage. Right now there's not much in Mongo, so this shouldn't be too important.


## Creating the GroupMe Bot<a name="bot"></a>

1. Set up a dev account on [https://dev.groupme.com/bots](https://dev.groupme.com/bots)
2. Go to "Bots" on the top navigation and create a new bot, following the prompts as needed. The Callback URL should correspond to the URL that your code is deployed to. For example, if you are deploying to Heroku: https://groupme-bot-deployed-location.herokuapp.com/

## TODO:
* Add documentation for setting up Heroku/debugging
* Add documentation for command structure/how to add additional commands