-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "location" DROP DEFAULT;
