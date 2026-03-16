<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>V2 EXP Booking</title>

<script src="/socket.io/socket.io.js"></script>

<style>

body{
background:#111;
color:white;
font-family:Arial;
margin:0;
text-align:center;
}

h1{
margin:20px;
}

.calendar{
margin:20px;
}

.container{
max-width:1200px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:15px;
padding:20px;
}

.slot{
background:#1a1a1a;
border-radius:10px;
border:2px solid #6a5125;
padding:10px;
}

.free{
border-color:#3fa34d;
}

.taken{
border-color:#a33;
}

.blocked{
border-color:#666;
background:#333;
}

button{
background:#3b2a0f;
border:1px solid #caa64a;
color:#ffd36a;
padding:4px 8px;
margin-top:5px;
cursor:pointer;
}

</style>

</head>

<body>

<h1>EXP V2 BOOKING</h1>

<div class="calendar">

<button onclick="prevDay()">◀</button>

<span id="day"></span>

<button onclick="nextDay()">▶</button>

</div>

<div>

<input id="adminPass" placeholder="Admin password">
<button onclick="loginAdmin()">Admin login</button>

</div>

<div id="stats"></div>

<div class="container" id="slots"></div>

<script>

const socket = io()

let bookings={}
let currentDay = new Date().toISOString().slice(0,10)

let admin=false

function formatDay(){
document.getElementById("day").innerText=currentDay
}

function prevDay(){
let d=new Date(currentDay)
d.setDate(d.getDate()-1)
currentDay=d.toISOString().slice(0,10)
render()
}

function nextDay(){
let d=new Date(currentDay)
d.setDate(d.getDate()+1)
currentDay=d.toISOString().slice(0,10)
render()
}

function loginAdmin(){

if(document.getElementById("adminPass").value==="platforma"){
admin=true
render()
}

}

function render(){

formatDay()

let container=document.getElementById("slots")
container.innerHTML=""

let dayData = bookings[currentDay] || {}

let yang=0
let sm=0

for(let h=0;h<24;h++){

let time = String(h).padStart(2,"0")+":00"

let div=document.createElement("div")
div.className="slot"

let data=dayData[time]

if(!data){

div.classList.add("free")

div.innerHTML=`
<b>${time}</b>
<div>WOLNE</div>
<input id="p_${time}" placeholder="Nick">
<select id="pay_${time}">
<option>Yang</option>
<option>SM</option>
</select>
<input id="pin_${time}" placeholder="PIN">
<button onclick="book('${time}')">Rezerwuj</button>
`

}else if(data.blocked){

div.classList.add("blocked")

div.innerHTML=`<b>${time}</b><div>ZABLOKOWANE</div>`

if(admin){
div.innerHTML+=`<button onclick="adminDelete('${time}')">Odblokuj</button>`
}

}else{

div.classList.add("taken")

div.innerHTML=`
<b>${time}</b>
<div>${data.player}</div>
<div>${data.payment}</div>
<input id="pin_${time}" placeholder="PIN">
<button onclick="edit('${time}')">Edytuj</button>
<button onclick="cancel('${time}')">Anuluj</button>
`

if(data.payment==="Yang") yang++
if(data.payment==="SM") sm++

if(admin){
div.innerHTML+=`
<button onclick="adminDelete('${time}')">Usuń</button>
<button onclick="block('${time}')">Zablokuj</button>
`
}

}

container.appendChild(div)

}

if(admin){
document.getElementById("stats").innerHTML=
`Yang: ${yang} | SM: ${sm}`
}

}

function book(time){

let player=document.getElementById("p_"+time).value
let payment=document.getElementById("pay_"+time).value
let pin=document.getElementById("pin_"+time).value

socket.emit("book",{day:currentDay,time,player,payment,pin})

}

function edit(time){

let player=prompt("Nick")
let payment=prompt("Yang/SM")
let pin=document.getElementById("pin_"+time).value

socket.emit("edit",{day:currentDay,time,player,payment,pin})

}

function cancel(time){

let pin=document.getElementById("pin_"+time).value

socket.emit("cancel",{day:currentDay,time,pin})

}

function block(time){

socket.emit("block",{password:"platforma",day:currentDay,time})

}

function adminDelete(time){

socket.emit("adminDelete",{password:"platforma",day:currentDay,time})

}

socket.on("update",(data)=>{
bookings=data
render()
})

render()

</script>

</body>
</html>
