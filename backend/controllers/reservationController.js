const pool = require("../db")
const generatePin = require("../utils/generatePin")

exports.getSlots = async(req,res)=>{

 const result = await pool.query(
 "SELECT * FROM slots ORDER BY date,hour"
 )

 res.json(result.rows)
}

exports.createReservation = async(req,res)=>{

 const {slotId,type} = req.body
 const userId = req.user.id

 const pin = generatePin()

 const r = await pool.query(
 "INSERT INTO reservations(slot_id,owner_id,type,pin) VALUES($1,$2,$3,$4) RETURNING id",
 [slotId,userId,type,pin]
 )

 await pool.query(
 "INSERT INTO reservation_players(reservation_id,user_id) VALUES($1,$2)",
 [r.rows[0].id,userId]
 )

 res.json({pin})
}
