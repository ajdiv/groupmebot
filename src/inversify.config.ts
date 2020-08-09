import { Container } from "inversify";
import "reflect-metadata";
import Bot from "./bot";

let container = new Container();

container.bind<Bot>(Bot).to(Bot).inSingletonScope();

export default container;