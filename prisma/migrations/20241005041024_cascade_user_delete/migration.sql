-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
