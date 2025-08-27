/*
  Warnings:

  - Added the required column `userId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_name_key";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
