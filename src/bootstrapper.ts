import { connect, connection } from 'mongoose';
import path from 'path';

export class Bootstrapper {

  public static configureEnvVars(): void {
    if (process.env.NODE_ENV !== "production") {
      const dotenv = require("dotenv");
      const { error } = dotenv.config({ debug: true, path: path.join(__dirname, '../config/.env') });

      if (error) console.error(error);
    }
  }

  public static configureMongo(): void {
    const mongoDB = process.env.MONGODB_URI;
    if (!mongoDB) throw Error('Missing MONGODB_URI in env file');
    connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }
}