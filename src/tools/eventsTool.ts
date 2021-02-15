import _ from 'lodash';
import moment from 'moment';
import CustomEventModel = require('../models/Mongo/CustomEventModel');

export class EventsTool {

  public static async addEvent(gmeUserId: string, gmeGroupId: number, phrase: string): Promise<string> {

    let eventDate = this.parseEventDate(phrase);
    if (eventDate === null) return 'Invalid event date. Command must end in DD/MM/YYYY or DD-MM-YYYY';

    let eventName = this.parseEventName(phrase);
    if (!eventName) return 'Missing event name';

    const result = await CustomEventModel.findOne({ eventName: { $regex: new RegExp(eventName, "i") }, eventDate: eventDate });
    if (result) return `There's already an event called '${eventName}' on ${eventDate.toLocaleDateString()}`;

    let customEvent = new CustomEventModel({
      gmeUserId: gmeUserId,
      gmeGroupId: gmeGroupId,
      eventDate: eventDate,
      eventName: eventName
    });

    await customEvent.save();

    return `Event Created: '${eventName}' on ${eventDate.toLocaleDateString()}`;
  }

  public static async getAllUpcomingEvents(): Promise<string> {
    let today = new Date();
    today.setHours(0,0,0,0);

    let futureEvents = await CustomEventModel.find({ eventDate: { $gte: today } });
    futureEvents = _.orderBy(futureEvents, x => x.eventDate);

    if (futureEvents.length === 0) return 'No upcoming events scheduled';

    let result = '';
    for(let i = 0; i < futureEvents.length; i++){
      let item = futureEvents[i];
      result += item.eventName + ': ' + item.eventDate.toLocaleDateString();
      if(i !== futureEvents.length - 1) result += '\n';
    }
    return result;
  }

  public static async getAllPastEvents(): Promise<string> {
    let today = new Date();
    today.setHours(0,0,0,0);

    let pastEvents = await CustomEventModel.find({ eventDate: { $lte: today } });
    pastEvents = _.orderBy(pastEvents, x => x.eventDate, 'desc');

    if (pastEvents.length === 0) return 'No past events to show';

    let result = '';
    for(let i = 0; i < pastEvents.length; i++){
      let item = pastEvents[i];
      result += item.eventName + ': ' + item.eventDate.toLocaleDateString();
      if(i !== pastEvents.length - 1) result += '\n';
    }
    return result;
  }

  public static getHelpText(): string{
    return 'Event Commands: \n' +
    '"/events add EVENTNAME EVENTDATE" adds a new event \n' +
    '"/events list" shows all upcoming events \n'+
    '"/events past" shows all past events'
  }

  private static parseEventDate(str: string): Date {
    str = str.trim();
    let strArr = str.split(' ');
    let date = moment(strArr[strArr.length - 1]);
    let isValid = date.isValid();

    if (!isValid) return null;
    return date.toDate();
  }

  /** This method assumes we have successfully pulled a date string from the text, and text is prefixed with "/event add" */
  private static parseEventName(str: string): string {
    let strArr = str.split(' ');
    let substrArr = strArr.slice(2, strArr.length - 1);
    let newStr = substrArr.join(' ');
    return newStr;
  }
}