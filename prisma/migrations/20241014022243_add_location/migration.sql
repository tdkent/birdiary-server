/*
  Warnings:

  - Added the required column `location_id` to the `Sighting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sighting" ADD COLUMN     "location_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
