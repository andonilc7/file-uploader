const prisma = require("./prismaClient")

async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  })
  return user
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  return user
}

async function insertUser(username, password) {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password
    }
  })
  return user
}

module.exports = {
  getUserByUsername,
  insertUser,
  getUserById

}