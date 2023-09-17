import request from 'request-promise';
import { CompanyProfileApiResponse } from '../models/Stocks/CompanyProfileApiResponse';
import { Metric } from '../models/Stocks/Metric';
import { QuoteApiResponse } from '../models/Stocks/QuoteApiResponse';

export abstract class StockTool {

  private static readonly _finnhubUrl = "https://finnhub.io/api/v1/";

  public static async getBasicFinancials(ticker: string): Promise<Metric> {

    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `${this._finnhubUrl}stock/metric?symbol=${ticker}&metric=all&token=${apiKey}`;

    const stringResults: string = await request.get(url);
    const metrics = new Metric(JSON.parse(stringResults));

    return Promise.resolve(metrics);
  }

  public static async getCompanyData(ticker: string): Promise<CompanyProfileApiResponse> {

    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `${this._finnhubUrl}stock/profile2?symbol=${ticker}&token=${apiKey}`;

    const stringResults: string = await request.get(url);
    const result: CompanyProfileApiResponse = Object.assign(new CompanyProfileApiResponse(), JSON.parse(stringResults));

    return Promise.resolve(result);
  }

  public static async getDailyStatus(ticker: string): Promise<QuoteApiResponse> {

    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `${this._finnhubUrl}quote?symbol=${ticker}&token=${apiKey}`;

    const stringResults: string = await request.get(url);
    const quote = new QuoteApiResponse(JSON.parse(stringResults));

    return Promise.resolve(quote);
  }

}