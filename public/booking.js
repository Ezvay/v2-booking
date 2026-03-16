function renderSlots(){

if(!selectedDay) return

let container=document.getElementById("slots")
container.innerHTML=""

let dayData=bookings[selectedDay]||{}

if(dayData.blockedDay){
container.innerHTML="<h2 style='color:red'>EXP WYŁĄCZONE</h2>"
return
}

for(let h=0;h<24;h++){

let start=String(h).padStart(2,"0")+":00"
let end=String((h+1)%24).padStart(2,"0")+":00"

let div=document.createElement("div")
div.className="slot"

let slot=dayData[start]

if(!slot){

div.classList.add("free")

div.innerHTML=`
<div>${start} - ${end}</div>

<input id="p_${start}" placeholder="Nick">
<input id="pin_${start}" placeholder="PIN">

<button onclick="book('${start}',1)">Solo</button>
<button onclick="book('${start}',2)">Party2</button>
<button onclick="book('${start}',3)">Party3</button>
`

}else if(slot.blocked){

div.classList.add("blocked")
div.innerHTML=`${start}-${end} ZABLOKOWANE`

}else{

div.classList.add("taken")

let playersHTML=""

slot.players.forEach(p=>{
playersHTML+=`<div>${p.player}</div>`
})

div.innerHTML=`
<div>${start}-${end}</div>
<div>Party ${slot.type}</div>
${playersHTML}
<input id="p_${start}" placeholder="Nick">
<input id="pin_${start}" placeholder="PIN">
<button onclick="join('${start}')">Dołącz</button>
`

}

container.appendChild(div)

}

}

function book(time,type){

let player=document.getElementById("p_"+time).value
let pin=document.getElementById("pin_"+time).value

socket.emit("book",{day:selectedDay,time,player,pin,type})

}

function join(time){

let player=document.getElementById("p_"+time).value
let pin=document.getElementById("pin_"+time).value

socket.emit("book",{day:selectedDay,time,player,pin,type:3})

}
