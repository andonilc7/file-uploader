const express = require("express")
const expressSession = require("express-session")
const passport = require('passport');
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
// using one client instance thorughout app so not a bunch of database connection
const prisma = require("./db/prismaClient")
const path = require("node:path");
const authRouter = require("./routes/authRouter")
const fileRouter = require("./routes/fileRouter")
const folderRouter = require("./routes/folderRouter")
const errorMiddleware = require("./middleware/errorMiddleware")
const authMiddleware = require("./middleware/authMiddleware")

const flash = require("connect-flash")
require("./config/passport")

const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))
app.use(express.urlencoded({extended: false}))

app.use(
  expressSession({
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000 //this is in ms, so 1 day
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
)
app.use(passport.session())
app.use(flash())
// doing flash errors separate from the validation errors, for example
app.use((req, res, next) => {
  res.locals.flashErrors = req.flash("error")
  next()
})
// setting the current user so i can dynamically make adjustments in ejs (e.g. having login/signup button vs "Welcome [first name]!"
// also can use this for the messages so that i know that i can show the creator of a message and the time created if a user is logged in
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.user)
  next()
})


app.listen(3000, () => console.log("Server running on port 3000"))

app.use("/", authRouter) //handles auth stuff but also home page (for authenticated and non authenticated users)
// home page for authenticated users shows upload form, but the actual uplkoading gets passed to "/files/upload" route

// for indiv file CRUD and uploading files
app.use("/files", fileRouter)
// for displaying what is inside a folder, and doing folder crud
app.use("/folders", authMiddleware.ensureAuthenticated , folderRouter)

app.use(errorMiddleware.errorHandler)