const folderService = require("../db/folderService")
const fileService = require("../db/fileService")
const { folder } = require("../db/prismaClient")

async function getFolderIfAuthorized(userId, rawFolderId) {
  const folderId = parseInt(rawFolderId, 10)
  if (isNaN(folderId)) {
    throw new Error("Invalid_Folder_Id")
  }
  
  const folder = await folderService.getFolderById(folderId, userId)
  // console.log(parentFolder)
  // handles if folder isn't found or theyre not allowed access (bc not their user id)
  // doing one message so people wont know which for security reasons.
  if (!folder) {
    throw new Error("Folder_Not_Found") 
  }
  return folder
}

// helper function for getting contents and does logic for whether root or not
async function getContentsUnified(userId, rawParentFolderId=null) {
  if (rawParentFolderId) {
    // if the error throws in getFolderIfAuth.., itll propagate to controller
    // function so we dont need to do try catch here too
    const parentFolder = await getFolderIfAuthorized(userId, rawParentFolderId)
    const folders = await folderService.getChildFolders(parentFolder.id, userId)
    const files = await fileService.getFilesByFolderId(parentFolder.id, userId)
    return {parentFolder, folders, files}
  } else {
    // root contents
    const folders = await folderService.getRootFolders(userId)
    const files = await fileService.getRootFiles(userId)
    return {parentFolder: null, folders, files}
  }
}

async function getRootContents(req, res, next) {
  try {
    const { parentFolder, folders, files } = await getContentsUnified(req.user.id)
    res.render("folder-contents", { folder: null, subFolders: folders, files: files, editingFolderId: null })
  } catch(err) {
    next(err)
  }
}




async function getContentsByFolderId(req, res, next) {
  try {
    const {parentFolder, folders, files} = await getContentsUnified(req.user.id, req.params.folderId)
    res.render("folder-contents", { folder: parentFolder, subFolders: folders, files: files, editingFolderId: null })
  }  catch(err) {
    next(err)
  }
}

async function getRootFolderContentsWithEdit(req, res, next) {
  const { folders, files } = await getContentsUnified(req.user.id)
  // console.log(req.params)
  const subFolderId = parseInt(req.params.subFolderId, 10)
  // if letters for example
  // if isnt nan but isn't an actual subfolder id itll go 
  // to that id's edit but just wont show any edit bc of ejs conditional rendering
  if (isNaN(subFolderId)) {
    return res.redirect("/folders")
  }
  res.render("folder-contents", { folder: null, subFolders: folders, files: files, editingFolderId: subFolderId })
}

async function getContentsByFolderIdWithEdit(req, res, next) {
  try {
    const {parentFolder, folders, files} = await getContentsUnified(req.user.id, req.params.folderId)
    const subFolderId = parseInt(req.params.subFolderId, 10)
    // if letters for example
    // if isnt nan but isn't an actual subfolder id itll go 
    // to that id's edit but just wont show any edit bc of ejs conditional rendering
    if (isNaN(subFolderId)) {
      return res.redirect("/folders/" + req.params.folderId)
    }
    res.render("folder-contents", { folder: parentFolder, subFolders: folders, files: files, editingFolderId: subFolderId })
  }  catch(err) {
    next(err)
  }
}


// create
async function createFolder(req, res, next) {
  try {
    const {folderName, parentFolderId} = req.body

    if (parentFolderId) {
      // this commented out code provided a bug that would've let a user create a folder under another user's folder!
      // i fixed it with the uncommented code
      // const intParentFolderId = parseInt(parentFolderId, 10)
      // // if id is there but invalid, like if it was letters
      // if (isNaN(intParentFolderId)) {
      //   return res.status(400).send("Invalid parent folder id.")
      // }
      // await folderService.folderCreate(folderName, req.user.id, intParentFolderId)
      // res.redirect("/folders/" + parentFolderId)
      
      // ensures that the parent folder exists and belongs to the current user
      const parentFolder = await getFolderIfAuthorized(req.user.id, parentFolderId)
      await folderService.folderCreate(folderName, req.user.id, parentFolder.id)
      res.redirect("/folders/" + parentFolderId)
    } else {
      // creating at root level without passing parentFolderId (technically can do with passing itll just be undef instead of null)
      await folderService.folderCreate(folderName, req.user.id)
      // const folder = await folderService.folderCreate(req.body.fol)
      res.redirect("/folders")
    }
  } catch(err) {
    next(err)
  }
}

async function updateFolder(req, res, next) {
  try {
    // just using parentFolderId for redirection
  const {folderName, parentFolderId} = req.body
  const folderToUpdate = await getFolderIfAuthorized(req.user.id, req.params.folderId)
  const newFolder = await folderService.updateFolder(folderToUpdate.id, folderName)

  res.redirect("/folders" + (parentFolderId ? "/" + parentFolderId : ""))
  } catch(err) {
    next(err)
  }
  
}

async function deleteFolder(req, res, next) {
  try {
    // if it cant get it then it returns error and doesn't go on to delete function
    const folderToDelete = await getFolderIfAuthorized(req.user.id, req.params.folderId)
    const deletedFolder = await folderService.deleteFolder(folderToDelete.id)
    const parentFolderId = req.body.parentFolderId
    res.redirect("/folders" + (parentFolderId ? "/" + parentFolderId : ""))
  } catch(err) {
    next(err)
  }
}

module.exports = {
  getRootContents,
  createFolder,
  getContentsByFolderId,
  getContentsByFolderIdWithEdit,
  getRootFolderContentsWithEdit,
  updateFolder,
  deleteFolder
}