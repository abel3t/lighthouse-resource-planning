/*
  Warnings:

  - You are about to drop the column `curratorName` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "curratorName",
ADD COLUMN     "curatorName" TEXT;
