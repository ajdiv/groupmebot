import sinon = require('sinon');
import { expect } from 'chai';
import { CoolGuyCommand } from './coolGuyCommand';

const proxyquire = require('proxyquire')
const cool = require('cool-ascii-faces');

describe('Cool Guy Command Tests', () => {
  it('should return a face from the cool-ascii-faces module', async () => {
        // Arrange
    let coolCommand = new CoolGuyCommand();

    // Act
    let resultModel = await coolCommand.execute();

    // Assert
    expect(cool.faces).to.include(resultModel.text);
  });
});