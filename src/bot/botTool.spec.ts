import { beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import { CommandFactory } from '../commands/commandFactory';
import { CommandCheckLocation } from '../commands/constants/commandCheckLocation';
import { Command } from '../commands/models/command';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { Message } from '../groupme/models/message';
import { BotTool } from './botTool';

describe('Bot Tool Tests', () => {
  let messageStub: Message;
  let commandStub: Command;
  let getCommandStub = sinon.stub(CommandFactory, 'getCommand');
  let sendBotResponseSpy = sinon.stub(BotTool, <any>'sendBotResponse');

  beforeEach(() => {
    messageStub = new Message();

    commandStub = {
      commandText: ['/test'],
      commandCheckLocation: CommandCheckLocation.Start,
      helpText: 'For testing',
      execute: null};
  })

  it('should send nothing if the message sent was from a Bot', () => {
    messageStub.sender_type = SenderTypes.Bot;

    BotTool.readMessageAndRespond(messageStub);

    sinon.assert.notCalled(getCommandStub);
    sinon.assert.notCalled(sendBotResponseSpy);
  });

  it('should send nothing if the message sent had no text in it', () => {
    messageStub.text = '';

    BotTool.readMessageAndRespond(messageStub);

    sinon.assert.notCalled(getCommandStub);
  });

  it('should send nothing if the message contained no actionable command', () => {
    messageStub.text = '/test';

    getCommandStub.returns(null);
    sendBotResponseSpy.returns(null);

    BotTool.readMessageAndRespond(messageStub);

    sinon.assert.calledOnce(getCommandStub);
    sinon.assert.notCalled(sendBotResponseSpy);
  });
});