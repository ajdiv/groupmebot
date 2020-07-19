import { AwardsCommand } from './awardsCommand';
import sinon = require('sinon');

import AwardsService = require('../../services/awardSvc');

describe('Awards Command Tests', () => {
  it('should have the awardSvc.getAwards method run on execute', () => {
    let awardSvcSpy = sinon.stub(AwardsService, 'getAwards').returns(Promise.resolve('Test Awards Results'));
    let awardsCommand = new AwardsCommand();

    awardsCommand.execute();

    sinon.assert.calledOnce(awardSvcSpy);
  });
});