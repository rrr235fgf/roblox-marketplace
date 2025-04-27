import clientPromise from "./mongodb"

// Nombre de la base de datos
const DB_NAME = "Marketplace"

// Obtener la base de datos
export async function getDb() {
  const client = await clientPromise
  return client.db(DB_NAME)
}
