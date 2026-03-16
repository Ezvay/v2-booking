const express=require("express")
const app=express()
const http=require("http").createServer(app)
const io=require("socket.io")(http)
const fs=require("fs")

app.use(express.static("public"))

const FILE="data.json"
const ADMIN_PASSWORD="platforma"

let bookings={}

if(fs.existsSync(FILE)){
bookings=JSON.parse(fs.readFileSync(FILE))
}

function save(){
fs.writeFileSync(FILE,JSON.stringify(bookings,null,2))
}

function getDay(day){
if(!bookings[day]) bookings[day]={}
return bookings[day]
}

io.on("connection",(socket)=>{

socket.emit("update",bookings)

socket.on("book",(data)=>{

const {day,time,player,pin,type}=data

let d=getDay(day)

if(!d[time]){
d[time]={type:parseInt(type),players:[{player,pin}]}
save()
io.emit("update",bookings)
return
}

let slot=d[time]

if(slot.blocked) return
if(slot.players.length>=slot.type) return

slot.players.push({player,pin})

save()
io.emit("update",bookings)

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
io.emit("update",bookings)

})

socket.on("block",(data)=>{

const {password,day,time}=data

if(password!==ADMIN_PASSWORD) return

let d=getDay(day)

d[time]={blocked:true}

save()
io.emit("update",bookings)

})

socket.on("blockDay",(data)=>{

const {password,day}=data

if(password!==ADMIN_PASSWORD) return

bookings[day]={blockedDay:true}

save()
io.emit("update",bookings)

})

socket.on("adminDelete",(data)=>{

const {password,day,time}=data

if(password!==ADMIN_PASSWORD) return

let d=getDay(day)

delete d[time]

save()
io.emit("update",bookings)

})

})

http.listen(3000)
