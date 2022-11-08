import dotenv from 'dotenv';

import * as mongoose from 'mongoose';

dotenv.config();

export default async function createConnection() {
  let uri = '';
  if (process.env.MONGODB_LOCAL !== undefined) {
    uri = process.env.MONGODB_LOCAL;
  }

  await mongoose.connect(uri, (err: any) => {
    if (err) {
      Error('Error connecting to db', err);
    }
  });
}
