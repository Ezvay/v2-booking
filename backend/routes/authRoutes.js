const express = require("express")
const router = express.Router()

router.post("/register",(req,res)=>{
 res.json({message:"register endpoint"})
})

router.post("/login",(req,res)=>{
 res.json({message:"login endpoint"})
})

module.exports = router
