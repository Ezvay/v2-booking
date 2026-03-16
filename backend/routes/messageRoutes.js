const router = require("express").Router()

router.post("/send",(req,res)=>{

res.json({message:"message sent"})

})

router.get("/",(req,res)=>{

res.json([])

})

module.exports = router
