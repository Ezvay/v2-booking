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
