import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.get("/movies", async (req, res) => {
  const movies = await prisma.movie.findMany();
  return res.json(movies);
});
