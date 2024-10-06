-- DropForeignKey
ALTER TABLE "Bird" DROP CONSTRAINT "Bird_id_fkey";

-- CreateTable
CREATE TABLE "BirdImage" (
    "id" SERIAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "bird_id" INTEGER NOT NULL,

    CONSTRAINT "BirdImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BirdImage" ADD CONSTRAINT "BirdImage_bird_id_fkey" FOREIGN KEY ("bird_id") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
