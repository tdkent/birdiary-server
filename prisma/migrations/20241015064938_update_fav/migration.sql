-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_bird_id_fkey";

-- AlterTable
ALTER TABLE "Favorite" ALTER COLUMN "bird_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bird_id_fkey" FOREIGN KEY ("bird_id") REFERENCES "Bird"("id") ON DELETE SET NULL ON UPDATE CASCADE;
