const prisma = require("./prismaClient")

//   id Int @id @default(autoincrement())
// originalName String
// storedName String @unique
// encoding String
// mimetype String
// size Int
// user User @relation(fields: [userId], references:[id])
// userId Int 

async function postFileToDb(file, userId, uploadName, folderId=null) {
  // file data before checking about the folder id
  const fileData = {
    originalName: file.originalname,
    // just doing uploadName and will essentially function like "path" would
    // for supabase bc don't have any folders inside of the bucket, just doing all 
    // files on same level and handling folders in my backend
    uploadName: uploadName,
    encoding: file.encoding,
    mimetype: file.mimetype,
    size: file.size,
    userId: userId
  }
  if (folderId) {
    fileData.folderId = folderId
  }

  await prisma.file.create({
    data: fileData
  })
}

async function getRootFiles(userId) {
  const rootFiles = await prisma.file.findMany({
    where: {
      userId: userId,
      folderId: null
    }
  })
  return rootFiles
}

async function getFilesByFolderId(folderId, userId) {
  const files = await prisma.file.findMany({
    where: {
      userId: userId,
      folderId: folderId
    }
  })
  return files
}

async function getFileById(fileId, userId) {
  const file = await prisma.file.findFirst({
    where: {
      userId: userId,
      id: fileId
    }
  })

  return file
}

async function deleteFileById(fileId, userId) {
  const file = await prisma.file.deleteMany({
    where: {
      userId: userId,
      id: fileId
    }
  })

  return file
}


module.exports = {
  postFileToDb,
  getRootFiles,
  getFilesByFolderId,
  getFileById,
  deleteFileById
}