/*
  Warnings:

  - You are about to drop the column `bird_id` on the `Image` table. All the data in the column will be lost.
  - Added the required column `bird_name` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bird_id_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "bird_id",
ADD COLUMN     "bird_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bird_name_fkey" FOREIGN KEY ("bird_name") REFERENCES "Bird"("comm_name") ON DELETE RESTRICT ON UPDATE CASCADE;
