-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "bird_id" INTEGER NOT NULL,
    "attr" TEXT,
    "href" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bird_id_fkey" FOREIGN KEY ("bird_id") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
