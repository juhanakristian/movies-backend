import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const movies = JSON.parse(
  fs.readFileSync("./data/movies-compact.json", "utf-8")
);

async function init() {
  for (const movie of movies) {
    let actors = [];
    for (const actor of movie.actors) {
      const firstName = actor.firstName.trim();
      const lastName = actor.lastName.trim();
      const existingActor = await prisma.person.findUnique({
        where: { firstName_lastName: { firstName, lastName } },
      });

      if (existingActor) {
        actors.push(existingActor.id);
      } else {
        const newActor = await prisma.person.create({
          data: {
            firstName,
            lastName,
          },
        });
        actors.push(newActor.id);
      }
    }

    const firstName = movie.director.firstName.trim();
    const lastName = movie.director.lastName.trim();
    const existingDirector = await prisma.person.findUnique({
      where: { firstName_lastName: { firstName, lastName } },
    });

    let createOrConnnect;
    if (existingDirector) {
      createOrConnnect = {
        connect: {
          id: existingDirector.id,
        },
      };
    } else {
      createOrConnnect = {
        create: {
          firstName,
          lastName,
        },
      };
    }

    await prisma.movie.create({
      data: {
        ...movie,
        actors: {
          connect: actors.map((id) => ({ id })),
        },
        director: {
          ...createOrConnnect,
        },
      },
    });
  }
}

init();
