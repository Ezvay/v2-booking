const router = require("express").Router()
const pool = require("../db")

router.get("/slots", async(req,res)=>{

const slots = await pool.query(
"SELECT * FROM slots ORDER BY date,hour"
)

res.json(slots.rows)

})

router.post("/reserve", async(req,res)=>{

const {slotId,type,userId} = req.body

const pin = Math.floor(100000 + Math.random()*900000)

const r = await pool.query(
"INSERT INTO reservations(slot_id,owner_id,type,pin) VALUES($1,$2,$3,$4) RETURNING id",
[slotId,userId,type,pin]
)

await pool.query(
"INSERT INTO reservation_players(reservation_id,user_id) VALUES($1,$2)",
[r.rows[0].id,userId]
)

res.json({pin})

})

router.post("/join", async(req,res)=>{

const {reservationId,userId} = req.body

await pool.query(
"INSERT INTO reservation_players(reservation_id,user_id) VALUES($1,$2)",
[reservationId,userId]
)

res.json({message:"joined"})

})

module.exports = router
