/*
  Warnings:

  - You are about to drop the column `status` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Bird` table. All the data in the column will be lost.
  - Added the required column `rarity` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spec_id` to the `Bird` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bird" DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "rarity" INTEGER NOT NULL,
ADD COLUMN     "spec_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Species" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_id_key" ON "Species"("id");

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
