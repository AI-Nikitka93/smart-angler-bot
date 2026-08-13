import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { spots, catches } from "./schema.js";

export async function createSpot(userId: number, lat: number, lon: number, name?: string) {
  const result = await db.insert(spots).values({
    userId,
    lat,
    lon,
    name,
  }).returning();
  
  return result[0];
}

export async function getUserSpots(userId: number) {
  const userSpots = await db.select().from(spots).where(eq(spots.userId, userId));
  return userSpots;
}

export async function logCatch(spotId: number, fishType: string, weight: number) {
  // The catches table requires a userId, so we retrieve it from the spot
  const spotResult = await db.select().from(spots).where(eq(spots.id, spotId)).limit(1);
  if (spotResult.length === 0) {
    throw new Error("Spot not found");
  }
  
  const result = await db.insert(catches).values({
    userId: spotResult[0].userId,
    spotId,
    fishType,
    weight,
  }).returning();
  
  return result[0];
}
