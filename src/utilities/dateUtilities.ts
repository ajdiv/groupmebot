import moment from 'moment';

export abstract class DateUtilities {

    public static getTodayAndTomorrow() {
      // If we are before 4AM, consider 4AM of yesterday the start
      var now = moment(new Date());
      var begin;
      if (now.hour() < 4) {
        begin = now.subtract(1, 'days').startOf('day').add(4, 'hours').toDate();
      } else {
        begin = now.startOf('day').add(4, 'hours').toDate();
      }

      var end = moment(begin).add(1, 'days').subtract(1, 'milliseconds').toDate();

      return [begin, end];
    }
}