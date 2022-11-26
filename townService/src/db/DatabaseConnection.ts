import * as mongoose from 'mongoose';

/**
 * Creates a connection to the database. Prioritizes the deployed url if available, if not then goes to the local db.
 */
export default async function createConnection() {
  let uri = '';
  if (process.env.MONGODB_DEPLOYED !== undefined) {
    uri = process.env.MONGODB_DEPLOYED;
  } else if (process.env.MONGODB_LOCAL !== undefined) {
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
