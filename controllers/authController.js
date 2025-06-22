const { body, validationResult } = require("express-validator")
const db = require('../db/userService')
const bcrypt = require("bcryptjs")
const passport = require("passport")
require("dotenv").config()

function getSignUpForm(req, res) {
  res.render("sign-up-form")
}

async function postSignUpHandler(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("sign-up-form", {
      oldInput: req.body,
      errors: errors.array()
    })
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  try {
    const user = await db.insertUser(req.body.username, hashedPassword)
    res.redirect("/login")
  } catch (err) {
    if (err.code === 'P2002') {
      return res.render("sign-up-form", {
        oldInput: req.body,
        errors: [{msg: "Username must be unique."}]
      })

    }
    next(err)
  }
}

const postSignUp = [
  body("username").trim().notEmpty().withMessage("Username cannot be empty."),
  body("password").trim().notEmpty().withMessage("Password cannot be empty.").isLength({min: 8}).withMessage("Password must be at least 8 characters long."),
  postSignUpHandler
]

function getLoginForm(req, res) {
  res.render("login-form")
}

function postLogin(req, res, next) {
  console.log(req.body)
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next)
}

function getLogout(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
}

function getHomePage(req, res) {
  res.render("home")
}

async function getGuestMode(req, res, next) {
  const user = await db.getUserByUsername(process.env.GUEST_USERNAME)
  req.login(user, (err) => {
    if (err) {
      next(err)
    }
    // this is inside the callback function bc req.login is asynchronous so we have to wait
    // happens after error checking
    // so once we are clean, no errors, we are free to go here 
    res.redirect("/")
  })

}



module.exports = {
  getSignUpForm,
  postSignUp,
  getLoginForm,
  postLogin,
  getLogout,
  getHomePage,
  getGuestMode
}