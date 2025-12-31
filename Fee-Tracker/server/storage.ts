import {
  type Fee,
  type InsertFee,
  type Log,
  type InsertLog
} from "@shared/schema";

export interface IStorage {
  getFees(): Promise<Fee[]>;
  createFee(fee: InsertFee): Promise<Fee>;
  getLogs(): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;
  deleteLog(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private fees: Fee[] = [];
  private logs: Log[] = [];
  private feeIdCounter = 1;
  private logIdCounter = 1;

  async getFees(): Promise<Fee[]> {
    return this.fees;
  }

  async createFee(insertFee: InsertFee): Promise<Fee> {
    const fee: Fee = { ...insertFee, id: this.feeIdCounter++ };
    this.fees.push(fee);
    return fee;
  }

  async getLogs(): Promise<Log[]> {
    return this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const log: Log = { 
      ...insertLog, 
      id: this.logIdCounter++, 
      timestamp: new Date() 
    };
    this.logs.push(log);
    return log;
  }

  async deleteLog(id: number): Promise<void> {
    this.logs = this.logs.filter(l => l.id !== id);
  }
}

export const storage = new MemStorage();
