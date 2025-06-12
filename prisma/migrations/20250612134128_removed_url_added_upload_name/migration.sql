/*
  Warnings:

  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploadName]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "url",
ADD COLUMN     "uploadName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_uploadName_key" ON "File"("uploadName");
