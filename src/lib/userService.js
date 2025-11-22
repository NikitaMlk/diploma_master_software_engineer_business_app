import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function findUserById(userId) {
  if (!userId) return null;

  const { db } = await connectToDatabase();
  const objectId = new ObjectId(userId);

  let user = await db.collection("users").findOne({ _id: objectId });

  if (!user) {
    user = await db.collection("trusted_users").findOne({ _id: objectId });
    if (user && !user.role) {
      user.role = "admin"; // fallback if trusted user has no role field
    }
  }

  return user;
}
