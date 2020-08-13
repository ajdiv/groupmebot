import sinon from 'sinon';
import { AwardsTool } from '../../tools/awardsTool';
import { AwardsCommand } from './awardsCommand';

describe('Awards Command Tests', () => {
  it('should have the awardSvc.getAwards method run on execute', () => {
    let awardSvcSpy = sinon.stub(AwardsTool, 'getAwards').returns(Promise.resolve('Test Awards Results'));
    let awardsCommand = new AwardsCommand();

    awardsCommand.execute();

    sinon.assert.calledOnce(awardSvcSpy);
  });
});