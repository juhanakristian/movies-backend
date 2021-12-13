-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Actor" DROP CONSTRAINT "Actor_personId_fkey";

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
