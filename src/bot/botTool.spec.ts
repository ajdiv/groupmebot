import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import { CommandFactory } from '../commands/commandFactory';
import { CommandCheckLocation } from '../commands/constants/commandCheckLocation';
import { Command } from '../commands/models/command';
import { SenderTypes } from '../groupme/constants/senderTypes';
import { Message } from '../groupme/models/message';
import { BotResponse } from './botResponse';
import { BotTool } from './botTool';

chai.use(chaiAsPromised);

describe('Bot Tool Tests', () => {
  const postUrl = 'https://api.groupme.com/v3/bots/post';

  // Custom input/outputs we're configuring ourselves
  let testMessage: Message;
  let testCommand: Command;
  let testCommandResult: BotResponse;

  // Spies/stubs
  let axiosStub: MockAdapter = new MockAdapter(axios);
  let getCommandStub = sinon.stub(CommandFactory, 'getCommand');
  let axiosSpy = sinon.spy(axios, 'post');

  beforeEach(() => {
    // Create "fresh" instances of our custom inputs/outputs
    testMessage = new Message();
    testCommandResult = new BotResponse('Test Result');
    testCommand = {
      commandText: ['/test'],
      commandCheckLocation: CommandCheckLocation.Start,
      helpText: 'For testing',
      execute: () => {
        return Promise.resolve(testCommandResult)
      }
    };
  })

  afterEach(() => {
    // Clean out our spies/stubs
    axiosStub.reset();
    getCommandStub.resetHistory();
    axiosSpy.resetHistory();
  })

  it('should send nothing if no input was given', async () => {
    // Arrange
    testMessage = null;

    // Act
    await BotTool.readMessageAndRespond(testMessage);

    // Assert
    sinon.assert.notCalled(getCommandStub);
    sinon.assert.notCalled(axiosSpy);
  });


  it('should send nothing if the message sent was from a Bot', async () => {
    // Arrange
    testMessage.sender_type = SenderTypes.Bot;

    // Act
    await BotTool.readMessageAndRespond(testMessage);

    // Assert
    sinon.assert.notCalled(getCommandStub);
    sinon.assert.notCalled(axiosSpy);
  });

  it('should send nothing if the message sent had no text in it', async () => {
    // Arrange
    testMessage.text = '';

    // Act
    await BotTool.readMessageAndRespond(testMessage);

    // Assert
    sinon.assert.notCalled(getCommandStub);
    sinon.assert.notCalled(axiosSpy);
  });

  it('should send nothing if the message contained no actionable command', async () => {
    // Arrange
    testMessage.text = '/test';
    getCommandStub.returns(null);

    // Act
    await BotTool.readMessageAndRespond(testMessage);

    // Assert
    sinon.assert.calledOnce(getCommandStub);
  });

  it('should send a POST request to GroupMe and return command result when successful', async () => {
    // Arrange
    testMessage.text = '/test';
    getCommandStub.returns(testCommand);
    axiosStub.onPost(postUrl).reply(200);

    // Act
    let results = await BotTool.readMessageAndRespond(testMessage);

    // Assert
    sinon.assert.calledOnce(axiosSpy);
    expect(results).to.equal(testCommandResult.text)
  });

  it('should throw an error when there is an error sending the message to GroupMe service', async () => {
    // Arrange
    testMessage.text = '/test';
    getCommandStub.returns(testCommand);
    axiosStub.onPost(postUrl).networkError();

    // Act (& Assert)
    await expect(BotTool.readMessageAndRespond(testMessage)).to.eventually.be.rejectedWith(Error);
  });
});