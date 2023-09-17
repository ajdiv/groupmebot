
export class QuoteApiResponse {
  currentPrice: number;
  priceAtOpen: number;
  changeFromOpen: number;
  percentChangeFromOpen: number;
  dailyHigh: number;
  dailyLow: number;

  constructor(jsonString: any) {
    this.currentPrice = jsonString["c"];
    this.priceAtOpen = jsonString["o"];
    this.changeFromOpen = jsonString["d"];
    this.percentChangeFromOpen = jsonString["dp"];
    this.dailyHigh = jsonString["h"];
    this.dailyLow = jsonString["l"];
  }
}