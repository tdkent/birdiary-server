/*
  Warnings:

  - You are about to drop the `UserLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserLocation" DROP CONSTRAINT "UserLocation_location_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLocation" DROP CONSTRAINT "UserLocation_user_id_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserLocation";

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
