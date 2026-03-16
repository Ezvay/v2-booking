const express = require("express")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(express.static("public"))

const FILE = "reservations.json"

function load(){

if(!fs.existsSync(FILE)){
fs.writeFileSync(FILE,"[]")
}

return JSON.parse(fs.readFileSync(FILE))

}

function save(data){

fs.writeFileSync(FILE,JSON.stringify(data,null,2))

}

app.get("/api/reservations",(req,res)=>{

res.json(load())

})

app.post("/api/reserve",(req,res)=>{

const data = load()

const pin = Math.floor(100000 + Math.random()*900000)

data.push({
date:req.body.date,
hour:req.body.hour,
type:req.body.type,
players:[req.body.nick],
pin
})

save(data)

res.json({pin})

})

app.post("/api/join",(req,res)=>{

const data = load()

const r = data.find(x=>x.pin==req.body.pin)

if(!r) return res.json({error:"not found"})

r.players.push(req.body.nick)

save(data)

res.json({ok:true})

})

app.post("/api/cancel",(req,res)=>{

let data = load()

data = data.filter(x=>x.pin != req.body.pin)

save(data)

res.json({ok:true})

})

app.listen(3000,()=>console.log("Server running"))
