
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  globalThis.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClient = client;
}

export default client;
