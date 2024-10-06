/*
  Warnings:

  - You are about to drop the `BirdImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BirdImage" DROP CONSTRAINT "BirdImage_bird_id_fkey";

-- DropTable
DROP TABLE "BirdImage";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "bird_id" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bird_id_fkey" FOREIGN KEY ("bird_id") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;