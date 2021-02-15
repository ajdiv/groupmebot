import moment from 'moment';
import request = require('request');
import CustomEventModel = require('../models/Mongo/CustomEventModel');

export class EventsTool {

  public static async addEvent(gmeUserId: string, gmeGroupId: number, phrase: string): Promise<string> {

    let eventDate = this.parseEventDate(phrase);
    if(eventDate === null) return 'Invalid event date. Command must end in DD/MM/YYYY or DD-MM-YYYY';

    let eventName = this.parseEventName(phrase);
    if(!eventName) return 'Missing event name';

    const result = await CustomEventModel.findOne({ eventName: {$regex : new RegExp(eventName, "i") }, eventDate: eventDate });
    if(result) return `There's already an event called '${eventName}' on ${eventDate.toLocaleDateString()}`;

    let customEvent = new CustomEventModel({
      gmeUserId: gmeUserId,
      gmeGroupId: gmeGroupId,
      eventDate: eventDate,
      eventName: eventName
    });

    await customEvent.save();

    return `Event Created: '${eventName}' on ${eventDate.toLocaleDateString()}`;
  }

  private static parseEventDate(str: string): Date {
    str = str.trim();
    let strArr = str.split(' ');
    let date = moment(strArr[strArr.length -1]);
    let isValid = date.isValid();

    if(!isValid) return null;
    return date.toDate();
  }

  /** This method assumes we have successfully pulled a date string from the text, and text is prefixed with "/event add" */
  private static parseEventName(str: string): string {
    let strArr = str.split(' ');
    let substrArr = strArr.slice(2, strArr.length-1);
    let newStr = substrArr.join(' ');
    return newStr;
  }
}