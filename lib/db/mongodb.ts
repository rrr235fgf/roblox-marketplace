import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("يرجى إضافة متغير البيئة MONGODB_URI")
}

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // في بيئة التطوير، استخدم متغير عام لتخزين اتصال MongoDB
  // هذا يمنع إنشاء اتصالات متعددة عند استخدام Hot Reloading
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // في بيئة الإنتاج، من الأفضل إنشاء اتصال جديد
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
