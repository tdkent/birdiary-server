/*
  Warnings:

  - Added the required column `currBirdId` to the `BirdOfTheDay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BirdOfTheDay" ADD COLUMN     "currBirdId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BirdOfTheDay" ADD CONSTRAINT "BirdOfTheDay_currBirdId_fkey" FOREIGN KEY ("currBirdId") REFERENCES "public"."Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
