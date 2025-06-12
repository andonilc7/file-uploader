/*
  Warnings:

  - You are about to drop the column `storedName` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_storedName_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "storedName";
