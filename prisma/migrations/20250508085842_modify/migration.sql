/*
  Warnings:

  - You are about to drop the `_ProjectUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectUsers" DROP CONSTRAINT "_ProjectUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectUsers" DROP CONSTRAINT "_ProjectUsers_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "projectId" INTEGER;

-- DropTable
DROP TABLE "_ProjectUsers";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
