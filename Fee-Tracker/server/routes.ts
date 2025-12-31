import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed initial fees if none exist
  const existingFees = await storage.getFees();
  if (existingFees.length === 0) {
    await storage.createFee({ name: "Not Locking Door", amount: 500 });
    await storage.createFee({ name: "Leaving Open Water Bottles on Floor", amount: 200 });
    await storage.createFee({ name: "Not Wiping Crumbs", amount: 800 });
    await storage.createFee({ name: "Leaving Food Out", amount: 1500 });
    await storage.createFee({ name: "Eating in Bedroom", amount: 2500 });
    await storage.createFee({ name: "Socks/Underwear on Floor", amount: 100 });
    await storage.createFee({ name: "Large Clothing Items on Floor", amount: 300 });
    await storage.createFee({ name: "Coat not on Rack", amount: 300 });
    await storage.createFee({ name: "Handbag on Dining Table", amount: 200 });
    await storage.createFee({ name: "Tissues not in Garbage", amount: 50 });
    await storage.createFee({ name: "Shoes on Inside", amount: 1000 });
    await storage.createFee({ name: "Forgetting Headphones at Work", amount: 500 });
    await storage.createFee({ name: "Shoes Not On Rack", amount: 200 });
    await storage.createFee({ name: "Leaving Pax Doors Open", amount: 200 });
    await storage.createFee({ name: "Leaving Dresser Drawers Open", amount: 200 });
  }

  app.get(api.fees.list.path, async (_req, res) => {
    const fees = await storage.getFees();
    res.json(fees);
  });

  app.get(api.logs.list.path, async (_req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const log = await storage.createLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.logs.delete.path, async (req, res) => {
    const logId = Number(req.params.id);
    if (isNaN(logId)) {
      return res.status(400).json({ message: 'Invalid log ID' });
    }
    await storage.deleteLog(logId);
    res.status(204).send();
  });

  return httpServer;
}
