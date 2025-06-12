const prisma = require('./prismaClient')

async function folderCreate(folderName, userId, parentId=null) {
  // testing first creating folders at route level
  
  if (parentId) {
    return await prisma.folder.create({
      data: {
        folderName: folderName,
        userId: userId,
        parentFolderId: parentId
      }
    })
  } else {
    return await prisma.folder.create({
      data: {
        folderName: folderName,
        userId: userId
      }
    })
  }
}

async function getRootFolders(userId) {
  return await prisma.folder.findMany({
    where: {
      userId: userId,
      parentFolderId: null
    }
  })
}

async function getChildFolders(parentId, userId) {
  return await prisma.folder.findMany({
    where: {
      userId: userId,
      parentFolderId: parentId
    }
  })
}

async function getFolderById(folderId, userId) {
  return await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId: userId
    }
  })
}

async function updateFolder(folderId, newFolderName) {
  return await prisma.folder.update({
    where: {
      id: folderId
    },
    data: {
      folderName: newFolderName
    }
  })
}

async function deleteFolder(folderId) {
  return await prisma.folder.delete({
    where: {
      id: folderId
    }
  })
}

module.exports = {
  folderCreate,
  getRootFolders,
  getChildFolders,
  getFolderById,
  updateFolder,
  deleteFolder
}