
export class Metric {
  High52Weeks: number;
  High52WeeksDate: Date;
  Low52Weeks: number;
  Low52WeeksDate: Date;

  constructor(jsonInput: any) {
    this.High52Weeks = jsonInput.metric["52WeekHigh"];
    this.High52WeeksDate = jsonInput.metric["52WeekHighDate"];
    this.Low52Weeks = jsonInput.metric["52WeekLow"];
    this.Low52WeeksDate = jsonInput.metric["52WeekLowDate"];
  }
}