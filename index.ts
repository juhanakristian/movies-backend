import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { nextTick } from "process";
const prisma = new PrismaClient();

const app = express();
const PORT = 8000;

function getList(param: any) {
  if (!param) return [];

  if (typeof param === "string") return [param];

  return param;
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello 👋");
});

app.get("/movies", async (req, res) => {
  const name = req.query.name;
  const years = getList(req.query.year)
    .map(Number)
    .filter((y: number) => !isNaN(y));

  let filters: any = [];

  if (name) {
    filters = [
      ...filters,
      {
        name: { contains: `${name}`, mode: "insensitive" },
      },
    ];
  }

  if (years.length) {
    filters = [
      ...filters,
      {
        year: { in: years },
      },
    ];
  }

  const movies = await prisma.movie.findMany({
    where: {
      AND: filters,
    },
  });

  return res.json(movies);
});

app.post("/movies", async (req, res, next) => {
  try {
    const { name, year, genres, ageLimit, rating, synopsis, director, actors } =
      req.body;

    const movie = await prisma.movie.create({
      data: {
        name,
        year,
        genres,
        ageLimit,
        rating,
        synopsis,
        actors: {
          connectOrCreate: [
            ...actors.map((actor: any) => ({
              where: {
                firstName_lastName: {
                  firstName: actor.firstName,
                  lastName: actor.lastName,
                },
              },
              create: { firstName: actor.firstName, lastName: actor.lastName },
            })),
          ],
        },
        director: {
          connectOrCreate: {
            where: {
              firstName_lastName: {
                firstName: director.firstName,
                lastName: director.lastName,
              },
            },
            create: {
              firstName: director.firstName,
              lastName: director.lastName,
            },
          },
        },
      },
    });

    return res.json(movie);
  } catch (e) {
    console.log(e);
    return next({ error: "Error creating movie", statusCode: 400 });
  }
});

app.get("/movies/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (!id) return next({ error: "Invalid id", statusCode: 400 });

  const movie = await prisma.movie.findUnique({
    where: {
      id,
    },
    include: { actors: true, director: true },
  });

  if (!movie) return next({ error: "Movie not found", statusCode: 404 });

  return res.json(movie);
});

interface Error {
  error?: string;
  statusCode?: number;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(err.statusCode || 500)
    .json({ error: err.error || "Internal server error" });
});
