import { type Fee, type InsertFee, type Log, type InsertLog, fees, logs } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getFees(): Promise<Fee[]>;
  createFee(fee: InsertFee): Promise<Fee>;
  getLogs(): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;
  deleteLog(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFees(): Promise<Fee[]> {
    return await db.select().from(fees);
  }

  async createFee(insertFee: InsertFee): Promise<Fee> {
    const [fee] = await db.insert(fees).values(insertFee).returning();
    return fee;
  }

  async getLogs(): Promise<Log[]> {
    return await db.select().from(logs).orderBy(desc(logs.timestamp));
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const [log] = await db.insert(logs).values(insertLog).returning();
    return log;
  }

  async deleteLog(id: number): Promise<void> {
    await db.delete(logs).where(eq(logs.id, id));
  }
}

export const storage = new DatabaseStorage();
