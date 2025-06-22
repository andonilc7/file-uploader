const supabase = require("../config/supabase")

async function main() {
  // console.log('hi')
  const { data, error } = await supabase.storage.from('file-uploader-user-storage').list()
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }

} 

main()