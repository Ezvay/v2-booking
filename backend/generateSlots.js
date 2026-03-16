const pool = require("./db")

async function generate(){

const today = new Date()

for(let d=0; d<30; d++){

 const date = new Date()
 date.setDate(today.getDate()+d)

 const formatted = date.toISOString().split("T")[0]

 for(let hour=0; hour<24; hour++){

  await pool.query(
   "INSERT INTO slots(date,hour) VALUES($1,$2)",
   [formatted,hour]
  )

 }

}

console.log("slots created")
process.exit()

}

generate()
