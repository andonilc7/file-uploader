const prisma = require("../db/prismaClient")
const folderService = require("../db/folderService")

async function main() {
  // return folderService.deleteFolder(33)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })