/*
  Warnings:

  - You are about to drop the column `birdId` on the `Sighting` table. All the data in the column will be lost.
  - Added the required column `commName` to the `Sighting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_birdId_fkey";

-- AlterTable
ALTER TABLE "Sighting" DROP COLUMN "birdId",
ADD COLUMN     "commName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_commName_fkey" FOREIGN KEY ("commName") REFERENCES "Bird"("commName") ON DELETE RESTRICT ON UPDATE CASCADE;
