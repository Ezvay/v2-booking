const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const fs = require("fs")

app.use(express.static("public"))

const DATA_FILE = "data.json"

let slots = {}

if(fs.existsSync(DATA_FILE)){
slots = JSON.parse(fs.readFileSync(DATA_FILE))
}

function saveData(){
fs.writeFileSync(DATA_FILE,JSON.stringify(slots,null,2))
}

const ADMIN_PASSWORD = "platforma"

io.on("connection",(socket)=>{

socket.emit("update",slots)

socket.on("book",(data)=>{

const {time,player,payment,pin} = data

if(slots[time]) return

slots[time] = {player,payment,pin}

saveData()

io.emit("update",slots)

})

socket.on("edit",(data)=>{

const {time,player,payment,pin} = data

if(slots[time] && slots[time].pin === pin){

slots[time].player = player
slots[time].payment = payment

saveData()

io.emit("update",slots)

}

})

socket.on("cancel",(data)=>{

const {time,pin} = data

if(slots[time] && slots[time].pin === pin){

delete slots[time]

saveData()

io.emit("update",slots)

}

})

socket.on("adminEdit",(data)=>{

const {password,time,player,payment} = data

if(password !== ADMIN_PASSWORD) return

slots[time] = {player,payment,pin:"admin"}

saveData()

io.emit("update",slots)

})

socket.on("adminDelete",(data)=>{

const {password,time} = data

if(password !== ADMIN_PASSWORD) return

delete slots[time]

saveData()

io.emit("update",slots)

})

})

http.listen(3000,()=>{
console.log("Server działa")
})
