/*
  Warnings:

  - You are about to drop the column `score` on the `LeaderboardEntry` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LeaderboardEntry_levelId_score_idx";

-- AlterTable
ALTER TABLE "LeaderboardEntry" DROP COLUMN "score";

-- CreateIndex
CREATE INDEX "LeaderboardEntry_levelId_timeSeconds_idx" ON "LeaderboardEntry"("levelId", "timeSeconds");
