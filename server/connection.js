const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.MONGO_URI || "";

let cachedClient = null;
let cachedDb = null;

async function getDb() {
    // If we already have a connection, return it immediately
    if (cachedDb) return cachedDb;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db("Routine");
    
    console.log("Connected to MongoDB");
    return cachedDb;
}

module.exports = { getDb };