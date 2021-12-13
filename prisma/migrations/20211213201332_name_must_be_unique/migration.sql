/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Person_firstName_lastName_key" ON "Person"("firstName", "lastName");
