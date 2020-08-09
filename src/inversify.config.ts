import { Container } from "inversify";
import "reflect-metadata";
import BotService from './services/botSvc';

let container = new Container();

container.bind<BotService>(BotService).to(BotService).inSingletonScope();

export default container;