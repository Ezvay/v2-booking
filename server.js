const express=require("express")
const app=express()
const http=require("http").createServer(app)
const io=require("socket.io")(http)

const fs=require("fs")
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")

app.use(express.static("public"))
app.use(express.json())

const DB="database.json"

function loadDB(){
return JSON.parse(fs.readFileSync(DB))
}

function saveDB(data){
fs.writeFileSync(DB,JSON.stringify(data,null,2))
}

const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
}
})

function sendMail(to,subject,text){

transporter.sendMail({
from:process.env.EMAIL_USER,
to,
subject,
text
})

}

app.post("/register",async(req,res)=>{

const db=loadDB()

const {nick,email,password,pin}=req.body

if(db.users.find(u=>u.nick===nick))
return res.json({ok:false})

const hash=await bcrypt.hash(password,10)

db.users.push({
nick,
email,
password:hash,
pin
})

saveDB(db)

sendMail(email,"V2 EXP konto","Twoje konto zostało utworzone")

res.json({ok:true})

})

app.post("/login",async(req,res)=>{

const db=loadDB()

const {nick,password}=req.body

const user=db.users.find(u=>u.nick===nick)

if(!user) return res.json({ok:false})

const ok=await bcrypt.compare(password,user.password)

if(!ok) return res.json({ok:false})

res.json({ok:true,user})

})

io.on("connection",(socket)=>{

socket.on("getBookings",()=>{

const db=loadDB()

socket.emit("bookings",db.bookings)

})

socket.on("book",(data)=>{

const db=loadDB()

const {day,time,nick,type}=data

if(!db.bookings[day])
db.bookings[day]={}

if(!db.bookings[day][time]){

db.bookings[day][time]={
type:type,
players:[nick]
}

}else{

if(db.bookings[day][time].players.length>=db.bookings[day][time].type)
return

db.bookings[day][time].players.push(nick)

}

db.stats.sm += type==1 ? 5000 : type==2 ? 2000 : 1500

saveDB(db)

io.emit("bookings",db.bookings)

})

socket.on("cancel",(data)=>{

const db=loadDB()

const {day,time,nick}=data

if(!db.bookings[day]) return

let slot=db.bookings[day][time]

slot.players=slot.players.filter(p=>p!==nick)

if(slot.players.length===0)
delete db.bookings[day][time]

saveDB(db)

io.emit("bookings",db.bookings)

})

socket.on("message",(data)=>{

const db=loadDB()

const {nick,text}=data

if(!db.messages[nick])
db.messages[nick]=[]

db.messages[nick].push({
from:"user",
text
})

saveDB(db)

})

})

http.listen(3000,()=>{

console.log("server start")

})
