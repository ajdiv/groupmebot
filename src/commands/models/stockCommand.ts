import _ from "lodash";
import { BotResponseModel } from "../../models/BotResponseModel";
import { GroupmeMessageModel } from "../../models/Groupme/GroupmeMessageModel";
import { StockTool } from "../../tools/stockTool";
import { CommandCheckLocation } from "../constants/commandCheckLocation";
import { Command } from "./command";

export class StockCommand implements Command {

  commandText = ['$'];
  commandCheckLocation = CommandCheckLocation.Contains;
  helpText = 'retrieves stock information for the provided ticker';

  constructor() { }

  async execute(request: GroupmeMessageModel): Promise<BotResponseModel> {
    let symbol = _.find(request.text.split(' '), x => { return x.startsWith('$') });
    if (!symbol) return null;
    symbol = symbol.substring(1);

    const companyData = await StockTool.getCompanyData(symbol);
    if (!companyData.ticker) return null;

    const dailyData = await StockTool.getDailyStatus(symbol);
    const basicFinancials = await StockTool.getBasicFinancials(symbol);

    const formattedMarketCap = Intl.NumberFormat('en-US', {
      //@ts-ignore
      notation: "compact",
      maximumFractionDigits: 3
    }).format(companyData.marketCapitalization);

    const resultText = `Stock data for ${companyData.name} (${companyData.ticker}):\n    ` +
    `Current Price: $${dailyData.currentPrice.toFixed(2)}\n    ` +
    `Open: $${dailyData.priceAtOpen.toFixed(2)}\n    ` +
    `Change: ${dailyData.percentChangeFromOpen.toFixed(2)}%\n    ` +
    `Market Cap: $${formattedMarketCap}\n    ` +
    `52 Week High: $${basicFinancials.High52Weeks.toFixed(2)} on ${basicFinancials.High52WeeksDate}\n    ` +
    `52 Week Low: $${basicFinancials.Low52Weeks.toFixed(2)} on ${basicFinancials.Low52WeeksDate}`;

    const result = new BotResponseModel(resultText, null);
    return result;
  }
}