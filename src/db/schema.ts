import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const spots = sqliteTable("spots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  name: text("name"),
  waterType: text("water_type"),
  waterName: text("water_name"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const catches = sqliteTable("catches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  spotId: integer("spot_id").references(() => spots.id),
  fishType: text("fish_type"),
  weight: real("weight"),
  photoUrl: text("photo_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
