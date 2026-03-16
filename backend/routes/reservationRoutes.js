const express = require("express")
const router = express.Router()
const pool = require("../db")

router.get("/slots", async (req,res)=>{

 const result = await pool.query(
  "SELECT * FROM slots ORDER BY date,hour"
 )

 res.json(result.rows)

})

module.exports = router

router.post("/reserve", async (req,res)=>{

const {slotId,type} = req.body

const pin = Math.floor(100000 + Math.random()*900000)

await pool.query(
"INSERT INTO reservations(slot_id,type,pin) VALUES($1,$2,$3)",
[slotId,type,pin]
)

res.json({message:"reserved",pin})

})
