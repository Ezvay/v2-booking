const API = "https://v2-booking-backend.onrender.com/api"

async function loadSlots(){

const res = await fetch(API + "/reservations/slots")
const slots = await res.json()

const container = document.getElementById("slots")
container.innerHTML = ""

slots.slice(0,200).forEach(slot=>{

const div = document.createElement("div")
div.className="slot"

div.innerHTML = `
<span>${slot.date} | ${slot.hour}:00</span>

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

async function cancelReservation(){

const pin = prompt("Podaj PIN rezerwacji")

if(!pin) return

await fetch(API + "/admin/cancel",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({pin:pin})

})

alert("Rezerwacja anulowana")

}

loadSlots()
