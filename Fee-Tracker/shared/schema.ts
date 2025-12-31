import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fees = pgTable("fees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(), // in cents
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  feeId: integer("fee_id").notNull(),
  feeName: text("fee_name").notNull(), // snapshot
  amount: integer("amount").notNull(), // snapshot in cents
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertFeeSchema = createInsertSchema(fees).omit({ id: true });
export const insertLogSchema = createInsertSchema(logs).omit({ id: true, timestamp: true });

export type Fee = typeof fees.$inferSelect;
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
