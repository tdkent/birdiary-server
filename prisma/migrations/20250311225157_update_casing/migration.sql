/*
  Warnings:

  - You are about to drop the column `comm_name` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `family_id` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `img_attr` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `sci_name` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `bird_id` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `bird_id` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Sighting` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commName]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sciName]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sightingId]` on the table `Sighting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commName` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyId` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sciName` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birdId` to the `Sighting` table without a default value. This is not possible if the table is not empty.
  - The required column `sightingId` was added to the `Sighting` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Sighting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_family_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_bird_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_bird_id_fkey";

-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_user_id_fkey";

-- DropIndex
DROP INDEX "Bird_comm_name_key";

-- DropIndex
DROP INDEX "Bird_sci_name_key";

-- DropIndex
DROP INDEX "Favorite_user_id_key";

-- DropIndex
DROP INDEX "Profile_user_id_key";

-- DropIndex
DROP INDEX "User_user_id_key";

-- AlterTable
ALTER TABLE "Bird" DROP COLUMN "comm_name",
DROP COLUMN "family_id",
DROP COLUMN "img_attr",
DROP COLUMN "sci_name",
ADD COLUMN     "commName" VARCHAR(60) NOT NULL,
ADD COLUMN     "familyId" SMALLINT NOT NULL,
ADD COLUMN     "imgAttr" VARCHAR(255),
ADD COLUMN     "sciName" VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "bird_id",
DROP COLUMN "user_id",
ADD COLUMN     "birdId" INTEGER,
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Sighting" DROP COLUMN "bird_id",
DROP COLUMN "location_id",
DROP COLUMN "user_id",
ADD COLUMN     "birdId" INTEGER NOT NULL,
ADD COLUMN     "locationId" INTEGER,
ADD COLUMN     "sightingId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bird_commName_key" ON "Bird"("commName");

-- CreateIndex
CREATE UNIQUE INDEX "Bird_sciName_key" ON "Bird"("sciName");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_key" ON "Favorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sighting_sightingId_key" ON "Sighting"("sightingId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_birdId_fkey" FOREIGN KEY ("birdId") REFERENCES "Bird"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_birdId_fkey" FOREIGN KEY ("birdId") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
