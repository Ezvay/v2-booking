<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>V2 Booking</title>

<script src="/socket.io/socket.io.js"></script>

<style>

body{
font-family:Arial;
background:#111;
color:white;
text-align:center;
margin:0;
}

h1{
margin-top:20px;
}

.container{
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:15px;
padding:20px;
}

.slot{
background:#1a1a1a;
border:2px solid #6a5125;
border-radius:8px;
padding:10px;
}

.free{
border-color:#3fa34d;
}

.taken{
border-color:#a33;
}

button{
margin-top:5px;
padding:4px 8px;
background:#3b2a0f;
border:1px solid #caa64a;
color:#ffd36a;
cursor:pointer;
border-radius:4px;
}

input,select{
width:90%;
margin-top:5px;
}

</style>
</head>

<body>

<h1>EXP V2 Booking</h1>

<div class="container" id="slots"></div>

<script>

const socket = io()

const container = document.getElementById("slots")

let slots = {}

function createSlot(time){

let div = document.createElement("div")
div.className="slot"

let title = document.createElement("div")
title.innerHTML="<b>"+time+"</b>"

div.appendChild(title)

if(!slots[time]){

div.classList.add("free")

div.innerHTML += `
<div>WOLNE</div>
<input placeholder="Nick" id="p_${time}">
<select id="pay_${time}">
<option>Yang</option>
<option>SM</option>
</select>
<input placeholder="PIN" id="pin_${time}">
<button onclick="book('${time}')">Rezerwuj</button>
`

}else{

div.classList.add("taken")

let s = slots[time]

div.innerHTML += `
<div>${s.player}</div>
<div>${s.payment}</div>
<input placeholder="PIN" id="pin_${time}">
<button onclick="edit('${time}')">Edytuj</button>
<button onclick="cancel('${time}')">Anuluj</button>
`

}

container.appendChild(div)

}

function render(){

container.innerHTML=""

for(let h=0;h<24;h++){

let time = String(h).padStart(2,"0")+":00"

createSlot(time)

}

}

function book(time){

let player = document.getElementById("p_"+time).value
let payment = document.getElementById("pay_"+time).value
let pin = document.getElementById("pin_"+time).value

socket.emit("book",{time,player,payment,pin})

}

function edit(time){

let player = prompt("Nowy nick")
let payment = prompt("Yang / SM")
let pin = document.getElementById("pin_"+time).value

socket.emit("edit",{time,player,payment,pin})

}

function cancel(time){

let pin = document.getElementById("pin_"+time).value

socket.emit("cancel",{time,pin})

}

socket.on("update",(data)=>{

slots = data

render()

})

</script>

</body>
</html>
