const pool = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async(req,res)=>{

 const {username,password} = req.body

 const hash = await bcrypt.hash(password,10)

 await pool.query(
 "INSERT INTO users(username,password) VALUES($1,$2)",
 [username,hash]
 )

 res.json({message:"registered"})
}

exports.login = async(req,res)=>{

 const {username,password} = req.body

 const user = await pool.query(
 "SELECT * FROM users WHERE username=$1",
 [username]
 )

 if(!user.rows.length)
  return res.status(401).json({error:"user not found"})

 const valid = await bcrypt.compare(
 password,
 user.rows[0].password
 )

 if(!valid)
  return res.status(401).json({error:"wrong password"})

 const token = jwt.sign(
 {id:user.rows[0].id},
 process.env.JWT_SECRET
 )

 res.json({token})
}
