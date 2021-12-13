/*
  Warnings:

  - You are about to drop the `Actor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_personId_fkey";

-- DropTable
DROP TABLE "Actor";

-- CreateTable
CREATE TABLE "_Actor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Actor_AB_unique" ON "_Actor"("A", "B");

-- CreateIndex
CREATE INDEX "_Actor_B_index" ON "_Actor"("B");

-- AddForeignKey
ALTER TABLE "_Actor" ADD FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Actor" ADD FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
