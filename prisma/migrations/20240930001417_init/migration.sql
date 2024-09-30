-- CreateTable
CREATE TABLE "Bird" (
    "id" SERIAL NOT NULL,
    "common_name" TEXT NOT NULL,

    CONSTRAINT "Bird_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bird_common_name_key" ON "Bird"("common_name");
