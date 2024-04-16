/*
  Warnings:

  - You are about to drop the `Disciple` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FundRecordType" AS ENUM ('Income', 'Expense');

-- DropForeignKey
ALTER TABLE "Disciple" DROP CONSTRAINT "Disciple_curatorId_fkey";

-- DropForeignKey
ALTER TABLE "Disciple" DROP CONSTRAINT "Disciple_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Disciple" DROP CONSTRAINT "Disciple_personId_fkey";

-- DropTable
DROP TABLE "Disciple";

-- CreateTable
CREATE TABLE "Discipleship" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "curatorId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Discipleship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundRecord" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contributorId" TEXT,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FundRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Discipleship_organizationId_curatorId_date_isDeleted_idx" ON "Discipleship"("organizationId", "curatorId", "date", "isDeleted");

-- AddForeignKey
ALTER TABLE "Discipleship" ADD CONSTRAINT "Discipleship_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipleship" ADD CONSTRAINT "Discipleship_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipleship" ADD CONSTRAINT "Discipleship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fund" ADD CONSTRAINT "Fund_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundRecord" ADD CONSTRAINT "FundRecord_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
