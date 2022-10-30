import { MongoClient, ServerApiVersion } from 'mongodb';
import validator from './SchemaValidation.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

export async function openConnection() {
  const uri =
    'mongodb+srv://' +
    process.env.MONGODB_USERNAME +
    ':' +
    process.env.MONGODB_PASSWORD +
    '@coveycrosswordleaderboa.ojrmge7.mongodb.net/?retryWrites=true&w=majority';
  console.log(uri);
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    console.log(client);
    await client.connect();
    console.log(client);
    await client
      .db('coveyCrosswordLeaderboard')
      .createCollection('Scores', JSON.stringify(validator));
    console.log(client);
    return client;
  } catch {
    console.log(console.error());
  } finally {
    await client.close();
  }
}

export async function closeConnection(client) {
  if (client) {
    try {
      client.close();
    } catch {
      console.log('unable to close database connection');
    }
  }
}

await openConnection();
