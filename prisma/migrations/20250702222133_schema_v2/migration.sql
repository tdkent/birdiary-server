/*
  Warnings:

  - You are about to drop the column `commName` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `imgAttr` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `sciName` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `commName` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `sightingId` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Family` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[commonName]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scientificName]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commonName` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scientificName` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birdId` to the `Sighting` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Sighting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_familyId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_birdId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_commName_fkey";

-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_userId_fkey";

-- DropIndex
DROP INDEX "Bird_commName_key";

-- DropIndex
DROP INDEX "Bird_sciName_key";

-- DropIndex
DROP INDEX "Sighting_sightingId_key";

-- DropIndex
DROP INDEX "User_userId_key";

-- AlterTable
ALTER TABLE "Bird" DROP COLUMN "commName",
DROP COLUMN "desc",
DROP COLUMN "familyId",
DROP COLUMN "imgAttr",
DROP COLUMN "sciName",
ADD COLUMN     "commonName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "family" TEXT NOT NULL,
ADD COLUMN     "imgAttribute" TEXT,
ADD COLUMN     "scientificName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Sighting" DROP COLUMN "commName",
DROP COLUMN "desc",
DROP COLUMN "sightingId",
ADD COLUMN     "birdId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId",
ADD COLUMN     "favoriteBirdId" INTEGER,
ADD COLUMN     "locationId" INTEGER,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Family";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "Bird_commonName_key" ON "Bird"("commonName");

-- CreateIndex
CREATE UNIQUE INDEX "Bird_scientificName_key" ON "Bird"("scientificName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteBirdId_fkey" FOREIGN KEY ("favoriteBirdId") REFERENCES "Bird"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_birdId_fkey" FOREIGN KEY ("birdId") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
