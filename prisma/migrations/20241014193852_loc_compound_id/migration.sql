/*
  Warnings:

  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `Sighting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_location_id_fkey";

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("user_id", "name");

-- AlterTable
ALTER TABLE "Sighting" DROP COLUMN "location_id",
ADD COLUMN     "loc_name" TEXT;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_user_id_loc_name_fkey" FOREIGN KEY ("user_id", "loc_name") REFERENCES "Location"("user_id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
