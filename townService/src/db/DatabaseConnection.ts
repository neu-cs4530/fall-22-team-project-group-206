import dotenv from 'dotenv';

import * as mongoose from 'mongoose';

dotenv.config();

export default async function createConnection() {
  let uri = '';
  if (process.env.MONGODB_LOCAL !== undefined) {
    uri = process.env.MONGODB_LOCAL;
  }

  try {
    await mongoose.connect(uri);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('Difficulty connecting to database.');
    }
  }
  
}
