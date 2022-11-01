
import dotenv from 'dotenv';

dotenv.config();

import * as mongoose from 'mongoose';

export function createConnection() {
  const uri: string = 'mongodb+srv://' +
process.env.MONGODB_USERNAME +
':' +
process.env.MONGODB_PASSWORD +
'@coveycrosswordleaderboa.ojrmge7.mongodb.net/?retryWrites=true&w=majority';


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


