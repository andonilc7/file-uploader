const { Router } = require("express")
const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")
const authRouter = Router()

authRouter.get("/sign-up", authMiddleware.ensureNotAuthenticated, authController.getSignUpForm)
authRouter.post("/sign-up", authMiddleware.ensureNotAuthenticated, authController.postSignUp)

authRouter.get("/login", authMiddleware.ensureNotAuthenticated, authController.getLoginForm)
authRouter.post("/login", authMiddleware.ensureNotAuthenticated, authController.postLogin)

authRouter.get("/guest-mode", authMiddleware.ensureNotAuthenticated, authController.getGuestMode)

// doing "/" as a home page for non-authenticated users, otherwise show the user's root folder
authRouter.get("/", authMiddleware.ensureNotAuthenticated, authController.getHomePage)

authRouter.get("/logout", authMiddleware.ensureAuthenticated, authController.getLogout)

module.exports = authRouter;