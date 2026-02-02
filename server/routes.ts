import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchOMDB, getOMDBById } from "./omdb";
import { searchQuerySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Search API endpoint
  app.post("/api/search", async (req, res) => {
    try {
      // Validate request body
      const validationResult = searchQuerySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid search query",
          details: validationResult.error.errors,
        });
      }
      
      const { query } = validationResult.data;
      
      // Search using OMDB API
      const searchResult = await searchOMDB(query);
      
      return res.json(searchResult);
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({
        error: "An error occurred while searching",
      });
    }
  });

  // Get movie/show by ID
  app.get("/api/title/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      
      const result = await getOMDBById(id);
      
      if (!result) {
        return res.status(404).json({ error: "Title not found" });
      }
      
      return res.json(result);
    } catch (error) {
      console.error("Get title error:", error);
      return res.status(500).json({
        error: "An error occurred while fetching the title",
      });
    }
  });

  return httpServer;
}
