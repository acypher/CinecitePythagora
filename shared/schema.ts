import { z } from "zod";

// Rating from a specific review source
export const ratingSchema = z.object({
  source: z.string(),
  score: z.number().nullable(),
  maxScore: z.number(),
  displayScore: z.string(),
  url: z.string().optional(),
});

export type Rating = z.infer<typeof ratingSchema>;

// Cast member
export const castMemberSchema = z.object({
  name: z.string(),
  character: z.string(),
  imageUrl: z.string().optional(),
});

export type CastMember = z.infer<typeof castMemberSchema>;

// Streaming availability
export const streamingInfoSchema = z.object({
  service: z.string(),
  type: z.enum(["subscription", "rent", "buy", "free"]),
  url: z.string().optional(),
});

export type StreamingInfo = z.infer<typeof streamingInfoSchema>;

// Complete movie/show result
export const movieResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number().nullable(),
  type: z.enum(["movie", "tv"]),
  posterUrl: z.string(),
  backdropUrl: z.string().optional(),
  plotSummary: z.string(),
  ratings: z.array(ratingSchema),
  cast: z.array(castMemberSchema),
  director: z.string().optional(),
  genres: z.array(z.string()),
  runtime: z.string().optional(),
  streaming: z.array(streamingInfoSchema),
});

export type MovieResult = z.infer<typeof movieResultSchema>;

// Search query
export const searchQuerySchema = z.object({
  query: z.string().min(1, "Please enter a movie or TV show name"),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Search response
export const searchResponseSchema = z.object({
  result: movieResultSchema.nullable(),
  suggestions: z.array(z.object({
    id: z.string(),
    title: z.string(),
    year: z.number().nullable(),
    type: z.enum(["movie", "tv"]),
    posterUrl: z.string(),
  })),
  matchConfidence: z.enum(["high", "medium", "low"]),
  warnings: z.array(z.string()).optional(),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// Keep existing user schema for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
