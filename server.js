const express=require("express")
const app=express()
const http=require("http").createServer(app)
const io=require("socket.io")(http)
const fs=require("fs")

app.use(express.static("public"))

const FILE="data.json"
const ADMIN_PASSWORD="platforma"

let bookings={}
let stats={sm:0,yang:0}
let chat=[]

if(fs.existsSync(FILE)){
let data=JSON.parse(fs.readFileSync(FILE))
bookings=data.bookings||{}
stats=data.stats||stats
chat=data.chat||[]
}

function save(){
fs.writeFileSync(FILE,JSON.stringify({bookings,stats,chat},null,2))
}

function getDay(day){
if(!bookings[day]) bookings[day]={}
return bookings[day]
}

io.on("connection",(socket)=>{

socket.emit("init",{bookings,stats,chat})

socket.on("book",(data)=>{

const {day,time,player,pin,type}=data
let d=getDay(day)

if(!d[time]){
d[time]={type,players:[{player,pin}]}
}else{
if(d[time].players.length>=d[time].type) return
d[time].players.push({player,pin})
}

if(type===1) stats.sm+=5000
if(type===2) stats.sm+=2000
if(type===3) stats.sm+=1500

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("cancel",(data)=>{

const {day,time,pin}=data
let d=getDay(day)

if(!d[time]) return

d[time].players=d[time].players.filter(p=>p.pin!==pin)

if(d[time].players.length===0){
delete d[time]
}

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("blockHour",(data)=>{

if(data.password!==ADMIN_PASSWORD) return

let d=getDay(data.day)
d[data.time]={blocked:true}

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("unblockHour",(data)=>{

if(data.password!==ADMIN_PASSWORD) return

let d=getDay(data.day)
delete d[data.time]

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("blockDay",(data)=>{

if(data.password!==ADMIN_PASSWORD) return

bookings[data.day]={blockedDay:true}

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("unblockDay",(data)=>{

if(data.password!==ADMIN_PASSWORD) return

delete bookings[data.day]

save()
io.emit("update",{bookings,stats,chat})

})

socket.on("chat",(msg)=>{

chat.push(msg)
if(chat.length>100) chat.shift()

save()
io.emit("chat",chat)

})

})

http.listen(3000)
