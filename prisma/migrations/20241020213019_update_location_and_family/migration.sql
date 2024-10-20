/*
  Warnings:

  - You are about to drop the column `user_id` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `Species` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_spec_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_user_id_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "Species";

-- CreateTable
CREATE TABLE "Family" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_id_key" ON "Family"("id");

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
