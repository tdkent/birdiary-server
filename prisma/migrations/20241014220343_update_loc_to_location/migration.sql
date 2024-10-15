/*
  Warnings:

  - You are about to drop the column `loc_name` on the `Sighting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_user_id_loc_name_fkey";

-- AlterTable
ALTER TABLE "Sighting" DROP COLUMN "loc_name",
ADD COLUMN     "location_name" TEXT;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_user_id_location_name_fkey" FOREIGN KEY ("user_id", "location_name") REFERENCES "Location"("user_id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
