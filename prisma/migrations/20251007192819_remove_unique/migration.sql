-- DropIndex
DROP INDEX "public"."Sighting_birdId_isNew_key";

-- AlterTable
ALTER TABLE "public"."Sighting" ALTER COLUMN "isNew" SET DEFAULT false;
