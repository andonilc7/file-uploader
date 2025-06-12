const supabase = require("../config/supabase")

async function main() {
  // console.log('hi')
  const { data, error } = await supabase.storage.getBucket('file-uploader-user-storage')
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }

} 

main()