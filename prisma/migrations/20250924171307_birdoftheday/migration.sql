-- CreateTable
CREATE TABLE "public"."BirdOfTheDay" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "birdIds" INTEGER[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BirdOfTheDay_pkey" PRIMARY KEY ("id")
);
