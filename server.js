const express = require("express")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(express.static("public"))

function read(file){
 if(!fs.existsSync(file)) fs.writeFileSync(file,"[]")
 return JSON.parse(fs.readFileSync(file))
}

function write(file,data){
 fs.writeFileSync(file,JSON.stringify(data,null,2))
}

app.get("/api/reservations",(req,res)=>{
 res.json(read("reservations.json"))
})

app.post("/api/reserve",(req,res)=>{

 const data = read("reservations.json")

 const pin = Math.floor(100000+Math.random()*900000)

 const r={
  date:req.body.date,
  hour:req.body.hour,
  type:req.body.type,
  players:[req.body.nick],
  pin
 }

 data.push(r)
 write("reservations.json",data)

 res.json({pin})
})

app.post("/api/join",(req,res)=>{

 const data=read("reservations.json")

 const r=data.find(x=>x.pin==req.body.pin)

 if(!r) return res.json({error:"not found"})

 r.players.push(req.body.nick)

 write("reservations.json",data)

 res.json({ok:true})

})

app.post("/api/cancel",(req,res)=>{

 let data=read("reservations.json")

 data=data.filter(x=>x.pin!=req.body.pin)

 write("reservations.json",data)

 res.json({ok:true})

})

app.get("/api/messages",(req,res)=>{
 res.json(read("messages.json"))
})

app.post("/api/messages",(req,res)=>{

 const m=read("messages.json")

 m.push({
  text:req.body.text,
  date:new Date()
 })

 write("messages.json",m)

 res.json({ok:true})

})

app.post("/api/lock",(req,res)=>{

 const locked=read("locked.json")

 locked.push({
  date:req.body.date,
  hour:req.body.hour
 })

 write("locked.json",locked)

 res.json({ok:true})

})

app.get("/api/locked",(req,res)=>{
 res.json(read("locked.json"))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
 console.log("server running on port " + PORT)
})
