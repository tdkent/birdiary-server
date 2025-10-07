/*
  Warnings:

  - Added the required column `isNew` to the `Sighting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sighting" ADD COLUMN     "isNew" BOOLEAN NOT NULL;
