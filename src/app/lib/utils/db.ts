import mongoose from 'mongoose';


// Add this type for clarity
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Correct global declaration for Node.js/Next.js
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Typecast global to avoid TS7017 warning
const globalWithMongoose = global as typeof globalThis & { mongoose?: MongooseCache };

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rugby-fixtures';

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  cached = cached!; // Tell TypeScript it's definitely defined now

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}