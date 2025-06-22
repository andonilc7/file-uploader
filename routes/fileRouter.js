const { Router } = require("express")
const fileController = require("../controllers/fileController")
const fileRouter = Router()
const authMiddleware = require("../middleware/authMiddleware")


// added in the authenticated middleware (general check for if user is authenticated)
// and then inside the non-create paths we also do a ownership check;
// cant just do midleware for that bc it is resource specific, so I have a helper function getFileIfAuthorized that checks
// that the file exists and that the logged-in user owns it before doing stuff with it
fileRouter.post("/upload", authMiddleware.ensureAuthenticated, fileController.postFile)
fileRouter.get("/:fileId", authMiddleware.ensureAuthenticated, fileController.getFileDetails)
fileRouter.get("/:fileId/download", authMiddleware.ensureAuthenticated, fileController.getDownloadFile)
fileRouter.post("/:fileId/delete", authMiddleware.ensureAuthenticated, fileController.postDeleteFile)

module.exports = fileRouter