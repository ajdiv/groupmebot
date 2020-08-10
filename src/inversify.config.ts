import { Container } from "inversify";
import "reflect-metadata";
import Bot from "./bot";
import CommandFactory from "./commands/commandFactory";

let container = new Container();

container.bind<Bot>(Bot).to(Bot).inSingletonScope();
container.bind<CommandFactory>(CommandFactory).to(CommandFactory).inSingletonScope();

export default container;