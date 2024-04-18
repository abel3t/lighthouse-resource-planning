/*
  Warnings:

  - Added the required column `fundId` to the `FundRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#77B6EA';

-- AlterTable
ALTER TABLE "FundRecord" ADD COLUMN     "fundId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FundRecord" ADD CONSTRAINT "FundRecord_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
