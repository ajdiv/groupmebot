import { Command } from '../models/CommandModel';
import { RequestBodyModel } from '../models/CustomHttpModels';
import { AwardsCommand } from './commands/awardsCommand';
import { CoolGuyCommand } from './commands/coolGuyCommand';
import { HereCommand } from './commands/hereCommand';
import { SpewCommand } from './commands/spewCommand';
import { ThesaurizeCommand } from './commands/thesaurizeCommand';
import { WednesdayCommand } from './commands/wednesdayCommand';

function getCommand(reqBody: RequestBodyModel): Command {
  const awardsRegex = /^\/awards$/;
  const coolGuyRegex = /^\/coolguy$/;
  const coolGuyRegexWithSpace = /^\/cool guy$/;
  const hereRegex = /@here$/;
  const spewRegex = /^\/spew$/;
  const thesaurusRegex = /^\/thesaurize$/;
  const wednesdayRegex = /^\/wednesday$/;

  if (reqBody.user_id && spewRegex.test(reqBody.text)) {
    return new SpewCommand();
  } else if (reqBody.text && (coolGuyRegex.test(reqBody.text) || coolGuyRegexWithSpace.test(reqBody.text))) {
    return new CoolGuyCommand();
  } else if (reqBody.text && thesaurusRegex.test(reqBody.text)) {
    return new ThesaurizeCommand();
  } else if (reqBody.text && hereRegex.test(reqBody.text)) {
    return new HereCommand();
  } else if (reqBody.text && awardsRegex.test(reqBody.text)) {
    return new AwardsCommand();
  } else if (reqBody.text && wednesdayRegex.test(reqBody.text)) {
    return new WednesdayCommand();
  }
  else return null;
}

export = {
  getCommand: getCommand
};