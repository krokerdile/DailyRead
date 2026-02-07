-- CreateEnum
CREATE TYPE "RssFetchStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "RssFetchLog" (
    "id" TEXT NOT NULL,
    "requestedUrl" TEXT NOT NULL,
    "resolvedRssUrl" TEXT,
    "status" "RssFetchStatus" NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogId" TEXT,

    CONSTRAINT "RssFetchLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RssFetchLog" ADD CONSTRAINT "RssFetchLog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
