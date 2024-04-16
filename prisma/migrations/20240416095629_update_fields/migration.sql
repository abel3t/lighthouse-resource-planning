/*
  Warnings:

  - Added the required column `type` to the `FundRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundRecord" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "type" "FundRecordType" NOT NULL;
