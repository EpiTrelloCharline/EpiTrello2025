-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'COMMENT_ADD';
ALTER TYPE "ActivityType" ADD VALUE 'MEMBER_ADD';
ALTER TYPE "ActivityType" ADD VALUE 'MEMBER_REMOVE';
ALTER TYPE "ActivityType" ADD VALUE 'ATTACHMENT_ADD';
ALTER TYPE "ActivityType" ADD VALUE 'ATTACHMENT_DELETE';
ALTER TYPE "ActivityType" ADD VALUE 'CHECKLIST_ADD';
ALTER TYPE "ActivityType" ADD VALUE 'CHECKLIST_DELETE';
ALTER TYPE "ActivityType" ADD VALUE 'CARD_ARCHIVE';
ALTER TYPE "ActivityType" ADD VALUE 'CARD_RESTORE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
