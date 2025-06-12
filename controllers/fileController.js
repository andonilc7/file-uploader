const multer = require("multer")
const path = require("node:path")
const fileService = require('../db/fileService')
const { decode } = require('base64-arraybuffer')
const supabase = require('../config/supabase')
// commenting out when i used to do with diskStorage
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './public/fileUploads')
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
//   }
// })
// const upload = multer({ storage: storage})

// now doing with in memory storage to upload to supabase
// also note that now we dont have req.file.filename attribute bc 
// that only exists when using diskStorage
const upload = multer()

async function getFileIfAuthorized(userId, rawFileId) {
  const fileId = parseInt(rawFileId, 10)
  if (isNaN(fileId)) {
    throw new Error("Invalid_File_Id")
  }
  
  const file = await fileService.getFileById(fileId, userId)
  // console.log(parentFolder)
  // handles if folder isn't found or theyre not allowed access (bc not their user id)
  // doing one message so people wont know which for security reasons.
  if (!file) {
    throw new Error("File_Not_Found") 
  }
  return file
}



// still have to connect to supabase for upload, and then hadnle download!
// and have to delete all the previous files from db that were there before using supabase!
async function postFileHandler(req, res, next) {
  try {
    const fileBase64 = decode(req.file.buffer.toString('base64'))
    const uploadName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.file.originalname)
    let intFolderId = null

    // handle folder id first, if invalid we end here, don't let it get uploaded anywhere
    if (req.body.folderId) {
      intFolderId = parseInt(req.body.folderId, 10)
      if (isNaN(intFolderId)) {
        return res.status(400).send("Invalid folder id during file creation.")
      }
    }

    // if valid folder or no folder, we upload file to supabase
    const {data, error} = await supabase.storage.from('file-uploader-user-storage').upload(uploadName, fileBase64, {
      contentType: req.file.mimetype
    })
    if (error) {
      throw error
    }

    // renaming data to image to dont cause problems with previous "data"
    // const { data:image } = supabase.storage.from('file-uploader-user-storage').getPublicUrl(uploadName)
    // realized I actually don't need url bc im handling the download in the express route 
    // so i just need to put the path (i.e. the upload name) and access with supabase js client
    // const url = image.publicUrl

    if (intFolderId) {
      await fileService.postFileToDb(req.file, req.user.id, uploadName, intFolderId)
      res.redirect("/folders/" + intFolderId)
    } else {
      await fileService.postFileToDb(req.file, req.user.id, uploadName)
      res.redirect("/folders")
    }

  } catch (err) {
    next(err)
  }
  
}



const postFile = [
  upload.single("file"),
  postFileHandler
]

async function getFileDetails(req, res, next) {
  try {
    const file = await getFileIfAuthorized(req.user.id, req.params.fileId)
    if (file.size >= 1024 * 1024) {
      file.formattedSize = `${(file.size/(1024*1024)).toFixed(2)} MB`
    } else if (file.size >= 1024) {
      file.formattedSize = `${(file.size/1024).toFixed(2)} KB`
    } else {
      file.formattedSize = `${file.size} Bytes`
    }
    // console.log(file)
    res.render("file-details", {file: file})
  } catch(err) {
    next(err)
  }
}

async function getDownloadFile(req, res, next) {
  try {
    // making sure the user owns the file first and it exists
    const file = await getFileIfAuthorized(req.user.id, req.params.fileId)
    // previous way when did res download for downloading from server (no supabase/cloud)
    // now going to look for the file on local and download it from there with res.download
    // const filePath = path.join(__dirname, "..", 'public/fileUploads', file.storedName);
    // // console.log(filePath)
    // // desiredFileName is what the user gets when they doiwnload it (the original name of file)
    // const desiredFileName = file.originalName
    // res.download(filePath, desiredFileName, (err) => {
    //   if (err) {
    //     return next(err)
    //   }
    // })
    // and the route stays on the one from before when doing res.download(...)

    // supabase way
    // supabase essentially fetches the file (in private bucket) and returns it (as Blob)
    const { data, error } = await supabase.storage.from('file-uploader-user-storage').download(file.uploadName)
    if (error) {
      throw error
    }
    console.log(data)
    // tells browser to expect whatever mime type the file has
    res.setHeader("Content-Type", data.type)
    // the attachment part says to download instead of displaying inline or something else
    // the filename part tells the browser what to name the file for the user
    res.setHeader("Content-Disposition", `attachment; filename=${file.originalName}`)

    // converting the Blob to an ArrayBuffer 
    // and then converting that ArrayBuffer to a Node.js Buffer so the broswer can handle it properly
    const arrayBuffer = await data.arrayBuffer()
    const nodeBuffer = Buffer.from(arrayBuffer)
    res.send(nodeBuffer)

  } catch(err) {
    next(err)
  }
}

module.exports = {
  postFile,
  getFileDetails,
  getDownloadFile
}