/*
  Warnings:

  - You are about to drop the `pdfs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pdfs";

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'uz',

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "isChunked" BOOLEAN NOT NULL DEFAULT false,
    "totalChunks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicationId" TEXT NOT NULL,
    "file" TEXT NOT NULL,

    CONSTRAINT "pdf_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_chunks" (
    "id" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfFileId" TEXT NOT NULL,

    CONSTRAINT "pdf_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlines" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicationId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "outlines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdf_chunks" ADD CONSTRAINT "pdf_chunks_pdfFileId_fkey" FOREIGN KEY ("pdfFileId") REFERENCES "pdf_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlines" ADD CONSTRAINT "outlines_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlines" ADD CONSTRAINT "outlines_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "outlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
