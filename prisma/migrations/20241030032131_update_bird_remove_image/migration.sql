/*
  Warnings:

  - You are about to drop the column `spec_id` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `desc` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_id` to the `Bird` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_spec_id_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_bird_id_fkey";

-- AlterTable
ALTER TABLE "Bird" DROP COLUMN "spec_id",
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "family_id" INTEGER NOT NULL,
ADD COLUMN     "img_attr" TEXT;

-- DropTable
DROP TABLE "Image";

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
