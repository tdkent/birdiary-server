/*
  Warnings:

  - A unique constraint covering the columns `[birdId,isNew]` on the table `Sighting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sighting_birdId_isNew_key" ON "public"."Sighting"("birdId", "isNew");
