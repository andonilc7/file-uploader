// for redirecting away if already authenticated, otherwise letting them proceed
function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/folders")
  } else {
    next()
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/")
  }
}

module.exports = {
  ensureNotAuthenticated,
  ensureAuthenticated
}