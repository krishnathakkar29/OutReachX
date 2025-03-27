/*
  Warnings:

  - You are about to drop the column `emailId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `recipients` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Email` table. All the data in the column will be lost.
  - Added the required column `outreachEmailId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_emailId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "emailId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outreachEmailId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "body",
DROP COLUMN "companyName",
DROP COLUMN "recipients",
DROP COLUMN "subject",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "emailAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachEmail" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Email_companyId_emailAddress_idx" ON "Email"("companyId", "emailAddress");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachEmail" ADD CONSTRAINT "OutreachEmail_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_outreachEmailId_fkey" FOREIGN KEY ("outreachEmailId") REFERENCES "OutreachEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
