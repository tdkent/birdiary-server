-- CreateTable
CREATE TABLE "Sighting" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bird_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "desc" TEXT,

    CONSTRAINT "Sighting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sighting" ADD CONSTRAINT "Sighting_bird_id_fkey" FOREIGN KEY ("bird_id") REFERENCES "Bird"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
