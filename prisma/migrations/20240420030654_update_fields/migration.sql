/*
  Warnings:

  - You are about to drop the column `faithStatus` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `introducedBy` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `weddingDate` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Care" ADD COLUMN     "curatorName" TEXT,
ADD COLUMN     "personName" TEXT;

-- AlterTable
ALTER TABLE "Discipleship" ADD COLUMN     "curatorName" TEXT,
ADD COLUMN     "personName" TEXT;

-- AlterTable
ALTER TABLE "FundRecord" ADD COLUMN     "contributorName" TEXT;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "faithStatus",
DROP COLUMN "introducedBy",
DROP COLUMN "weddingDate";
