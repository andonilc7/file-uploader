function errorHandler(err, req, res, next) {
  if (err.message === "Invalid_Folder_Id") {
    return res.status(400).send("Invalid Folder Id.")
  } else if (err.message === "Folder_Not_Found") {
    return res.status(400).send("Folder Not Found.")
  } else {
    next(err)
  }
}

module.exports = {
  errorHandler
}