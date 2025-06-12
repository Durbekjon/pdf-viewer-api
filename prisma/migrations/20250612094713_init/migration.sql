-- CreateEnum
CREATE TYPE "Language" AS ENUM ('uz', 'en', 'ru');

-- CreateTable
CREATE TABLE "pdfs" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'uz',
    "file" TEXT NOT NULL,

    CONSTRAINT "pdfs_pkey" PRIMARY KEY ("id")
);
