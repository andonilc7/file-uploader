-- AlterTable
ALTER TABLE "File" ADD COLUMN     "folderId" INTEGER;

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "folderName" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
