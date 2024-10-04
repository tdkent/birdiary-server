/*
  Warnings:

  - You are about to drop the column `common_name` on the `Bird` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comm_name]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sci_name]` on the table `Bird` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comm_name` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sci_name` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Bird` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Bird_common_name_key";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Bird" DROP COLUMN "common_name",
ADD COLUMN     "comm_name" TEXT NOT NULL,
ADD COLUMN     "sci_name" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bird_comm_name_key" ON "Bird"("comm_name");

-- CreateIndex
CREATE UNIQUE INDEX "Bird_sci_name_key" ON "Bird"("sci_name");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_id_fkey" FOREIGN KEY ("id") REFERENCES "Profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
