-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);
