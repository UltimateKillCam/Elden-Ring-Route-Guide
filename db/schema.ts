import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const publicSessions = sqliteTable("public_sessions", {
  code: text("code").primaryKey(),
  hostTokenHash: text("host_token_hash").notNull(),
  revision: integer("revision").notNull().default(0),
  mode: text("mode").notNull(),
  playerCount: integer("player_count").notNull(),
  expedition: text("expedition"),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const publicSessionGuests = sqliteTable("public_session_guests", {
  sessionCode: text("session_code").notNull().references(() => publicSessions.code, { onDelete: "cascade" }),
  playerId: text("player_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  name: text("name").notNull(),
  buildId: text("build_id").notNull(),
  startingClass: text("starting_class").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [primaryKey({ columns: [table.sessionCode, table.playerId] })]);

export const publicSessionRateLimits = sqliteTable("public_session_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  expiresAt: integer("expires_at").notNull(),
});
