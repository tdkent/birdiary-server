/*
  Warnings:

  - You are about to alter the column `comm_name` on the `Bird` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `sci_name` on the `Bird` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `desc` on the `Bird` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `family_id` on the `Bird` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `img_attr` on the `Bird` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `id` on the `Family` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `name` on the `Family` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `name` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `location` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `desc` on the `Sighting` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - Changed the type of `rarity` on the `Bird` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('Common', 'Uncommon', 'Rare');

-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_family_id_fkey";

-- AlterTable
ALTER TABLE "Bird" ALTER COLUMN "comm_name" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "sci_name" SET DATA TYPE VARCHAR(60),
DROP COLUMN "rarity",
ADD COLUMN     "rarity" "Rarity" NOT NULL,
ALTER COLUMN "desc" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "family_id" SET DATA TYPE SMALLINT,
ALTER COLUMN "img_attr" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "id" SET DATA TYPE SMALLINT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(120);

-- AlterTable
ALTER TABLE "Sighting" ALTER COLUMN "desc" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(36);

-- AddForeignKey
ALTER TABLE "Bird" ADD CONSTRAINT "Bird_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
