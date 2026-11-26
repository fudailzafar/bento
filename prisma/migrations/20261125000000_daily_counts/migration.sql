-- Visits and clicks are counted per day instead of stored one row each.

-- CreateTable
CREATE TABLE "PageViewDaily" (
    "pageId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PageViewDaily_pkey" PRIMARY KEY ("pageId","day")
);

-- CreateTable
CREATE TABLE "BlockClickDaily" (
    "pageId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlockClickDaily_pkey" PRIMARY KEY ("pageId","blockId","day")
);

-- CreateIndex
CREATE INDEX "BlockClickDaily_pageId_idx" ON "BlockClickDaily"("pageId");

-- AddForeignKey
ALTER TABLE "PageViewDaily" ADD CONSTRAINT "PageViewDaily_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockClickDaily" ADD CONSTRAINT "BlockClickDaily_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep the history: fold every stored visit and click into its day (UTC).
INSERT INTO "PageViewDaily" ("pageId", "day", "count")
SELECT "pageId", "createdAt"::date, COUNT(*)::int
FROM "PageView"
GROUP BY "pageId", "createdAt"::date;

INSERT INTO "BlockClickDaily" ("pageId", "blockId", "day", "count")
SELECT "pageId", "blockId", "createdAt"::date, COUNT(*)::int
FROM "BlockClick"
GROUP BY "pageId", "blockId", "createdAt"::date;

-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_pageId_fkey";

-- DropForeignKey
ALTER TABLE "BlockClick" DROP CONSTRAINT "BlockClick_pageId_fkey";

-- DropTable
DROP TABLE "PageView";

-- DropTable
DROP TABLE "BlockClick";
