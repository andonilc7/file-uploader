const { Router } = require("express")
const folderController = require("../controllers/folderController")
const { folder } = require("../db/prismaClient")
const folderRouter = Router()


folderRouter.get("/", folderController.getRootContents)
folderRouter.post("/create", folderController.createFolder)
// if we are editing a folder that is on the root folders pages
folderRouter.get("/edit-sub/:subFolderId", folderController.getRootFolderContentsWithEdit)
folderRouter.get("/:folderId", folderController.getContentsByFolderId)
folderRouter.get("/:folderId/edit-sub/:subFolderId", folderController.getContentsByFolderIdWithEdit)
folderRouter.post("/:folderId/update", folderController.updateFolder)
folderRouter.post("/:folderId/delete", folderController.deleteFolder)


module.exports = folderRouter