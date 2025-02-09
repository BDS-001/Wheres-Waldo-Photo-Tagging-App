/*
  Warnings:

  - Added the required column `levelNum` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "levelNum" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    "timeSeconds" DOUBLE PRECISION NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaderboardEntry_levelId_score_idx" ON "LeaderboardEntry"("levelId", "score");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_playerName_idx" ON "LeaderboardEntry"("playerName");

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
