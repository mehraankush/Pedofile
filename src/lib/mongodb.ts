import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL
if (!uri) throw new Error('Please add your Mongo URI to .env')

const options = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

const clientPromise: Promise<MongoClient> =
    globalThis._mongoClientPromise ?? new MongoClient(uri, options).connect()

// Cache the client in global scope in development
if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = clientPromise
}

export default clientPromise
