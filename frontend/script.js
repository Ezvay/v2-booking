const API = "https://v2-booking-backend.onrender.com/api"

let allSlots = []

async function loadSlots(){

const res = await fetch(API + "/reservations/slots")

allSlots = await res.json()

generateCalendar()

}

function generateCalendar(){

const calendar = document.getElementById("calendar")

calendar.innerHTML=""

const days = [...new Set(allSlots.map(s=>s.date))]

days.forEach(date=>{

const div = document.createElement("div")

div.className="day"

div.innerText = date

div.onclick = ()=>showSlots(date)

calendar.appendChild(div)

})

}

function showSlots(date){

document.getElementById("selectedDay").innerText = date

const container = document.getElementById("slots")

container.innerHTML=""

const slots = allSlots.filter(s=>s.date===date)

slots.forEach(slot=>{

const div = document.createElement("div")

div.className="slot"

div.innerHTML=`

<span>${slot.hour}:00</span>

<div>

<button onclick="reserve(${slot.id},'solo')">SOLO</button>
<button onclick="reserve(${slot.id},'duo')">DUO</button>
<button onclick="reserve(${slot.id},'trio')">TRIO</button>

</div>

`

container.appendChild(div)

})

}

async function reserve(slotId,type){

const userId = prompt("Podaj ID użytkownika")

if(!userId) return

const res = await fetch(API + "/reservations/reserve",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
slotId:slotId,
type:type,
userId:userId
})

})

const data = await res.json()

alert("Rezerwacja wykonana. PIN: "+data.pin)

}

async function lockSlot(){

const slotId = prompt("ID slotu do blokady")

await fetch(API + "/admin/lock",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
slotId:slotId
})

})

alert("Slot zablokowany")

}

loadSlots()
