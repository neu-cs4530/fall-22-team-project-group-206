
import dotenv from 'dotenv';

dotenv.config();

import * as mongoose from 'mongoose';

export function createConnection() {
  var uri: string = ''
  if (process.env.MONGODB_LOCAL !== undefined) {
    uri = process.env.MONGODB_LOCAL;
  }

mongoose.connect(uri, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Successfully Connected!");
  }
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', () => console.log('connection successful'));

}


