import moment = require('moment');
import { BotResponseModel } from "../../models/BotResponseModel";
import { CommandCheckLocation } from '../constants/commandCheckLocation';
import { Command } from "./command";


export class WednesdayCommand implements Command {

  commandText = ['/wed', '/wednesday'];
  commandCheckLocation = CommandCheckLocation.Start;

  private readonly dayINeed: number;

  constructor() {
    this.dayINeed = 3; // 1 based, Monday is 1 and Sunday is 7
  }

  async execute(): Promise<BotResponseModel> {
    const result = this.isItWednesday();
    return new BotResponseModel(result, null);
  }

  private isItWednesday(): string {
    let result: string;
    let now = moment().isoWeekday();
    if (now === this.dayINeed) {
      result = "https://media.giphy.com/media/dvDCHPFnxnYubsrNvl/giphy.gif";
    } else {
      let targetDate;
      if (now > this.dayINeed) {
        targetDate = moment().add(1, 'weeks').isoWeekday(this.dayINeed).startOf('day');
      } else {
        targetDate = moment().isoWeekday(this.dayINeed).startOf('day');
      }

      const diffMinutes = Math.ceil(targetDate.diff(moment(), 'minutes', true));
      const days = Math.floor(diffMinutes / 60 / 24); // 60 mins in an hour, 24 hours in a day
      const daysTense = days === 1 ? 'day' : 'days';
      // Get total diff in hours, subtract what we have in days already
      const hours = Math.floor(diffMinutes / 60) - (days * 24);
      const hoursTense = hours === 1 ? 'hour' : 'hours';
      // Get total diff in minutes, subtract what we have in days and hours already
      const mins = diffMinutes - hours * 60 - days * 24 * 60;
      const minsTense = mins === 1 ? 'minute' : 'minutes';

      result = `It's ${days} ${daysTense}, ${hours} ${hoursTense}, and ${mins} ${minsTense} until Wednesday my dudes.`;
    }
    return result;
  }
}