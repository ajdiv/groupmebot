// import { Command } from '../models/CommandModel';
// import { GroupmeMessageModel } from '../models/Groupme/GroupmeMessageModel';
// import { AwardsCommand } from './commands/awardsCommand';
// import { CoolGuyCommand } from './commands/coolGuyCommand';
// import { HereCommand } from './commands/hereCommand';
// import { SpewCommand } from './commands/spewCommand';
// import { ThesaurizeCommand } from './commands/thesaurizeCommand';
// import { WednesdayCommand } from './commands/wednesdayCommand';

// function getCommand(reqBody: GroupmeMessageModel): Command {

//   if (!reqBody.text) return null;
//   const text = reqBody.text.trim().toLowerCase();

//   if (text === '/spew') {
//     return new SpewCommand();
//   } else if (text === '/coolguy' || text === '/cool guy') {
//     return new CoolGuyCommand();
//   } else if (text === '/thesaurize') {
//     return new ThesaurizeCommand();
//   } else if (text.includes('@here')) {
//     return new HereCommand();
//   } else if (text === '/awards') {
//     return new AwardsCommand();
//   } else if (text === '/wed' || text === '/wednesday') {
//     return new WednesdayCommand();
//   }
//   else return null;
// }

// export = {
//   getCommand: getCommand
// };