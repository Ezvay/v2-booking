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

/* EMAIL */

const transporter=nodemailer.createTransport({
service:"gmail",
auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
}
})

function sendEmail(to,subject,text){
transporter.sendMail({
from:process.env.EMAIL_USER,
to,
subject,
text
})
}

/* LOGIN */

app.post("/login",(req,res)=>{

const db=loadDB()

const {nick,password}=req.body

const user=db.users.find(u=>u.nick===nick)

if(!user) return res.json({ok:false})

if(user.password!==password) return res.json({ok:false})

res.json({ok:true,user})

})

/* REGISTER */

app.post("/register",(req,res)=>{

const db=loadDB()

const {nick,email,password}=req.body

if(db.users.find(u=>u.nick===nick))
return res.json({ok:false})

db.users.push({
nick,
email,
password,
role:"user"
})

saveDB(db)

sendEmail(email,"Rejestracja V2 EXP","Twoje konto zostało utworzone.")

res.json({ok:true})

})

/* SOCKET */

io.on("connection",(socket)=>{

socket.on("getData",()=>{

const db=loadDB()

socket.emit("data",db)

})

socket.on("book",(data)=>{

const db=loadDB()

const {day,time,nick,type}=data

if(!db.bookings[day]) db.bookings[day]={}

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

saveDB(db)

io.emit("data",db)

})

/* PRIVATE CHAT */

socket.on("message",(msg)=>{

const db=loadDB()

if(!db.messages[msg.user])
db.messages[msg.user]=[]

db.messages[msg.user].push(msg)

saveDB(db)

})

})

http.listen(3000,()=>console.log("server start"))
