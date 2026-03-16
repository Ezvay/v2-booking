const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: { rejectUnauthorized: false }
});

async function generateSlots(){

 const today = new Date();

 for(let d = 0; d < 30; d++){

  const date = new Date();
  date.setDate(today.getDate() + d);

  const formattedDate = date.toISOString().split("T")[0];

  for(let hour = 0; hour < 24; hour++){

   await pool.query(
    "INSERT INTO slots(date, hour) VALUES($1,$2)",
    [formattedDate, hour]
   );

  }

 }

 console.log("Slots generated");

 process.exit();
}

generateSlots();
