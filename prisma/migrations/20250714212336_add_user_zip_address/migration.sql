/*
  Warnings:

  - You are about to drop the column `locationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "zipcode" INTEGER;
