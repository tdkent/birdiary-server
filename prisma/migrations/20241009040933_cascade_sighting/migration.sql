-- DropForeignKey
ALTER TABLE "Sighting" DROP CONSTRAINT "Sighting_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
