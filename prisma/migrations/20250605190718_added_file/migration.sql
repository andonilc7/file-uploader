-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_storedName_key" ON "File"("storedName");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
