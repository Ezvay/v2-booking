async function loadSlots(){

const res = await fetch("/api/reservations/slots")

const slots = await res.json()

const container = document.getElementById("slots")

slots.forEach(slot=>{

const div = document.createElement("div")

div.className="slot"

div.innerHTML = `
<span>${slot.date} ${slot.hour}:00</span>
<button onclick="reserve(${slot.id})">Rezerwuj</button>
`

container.appendChild(div)

})

}

async function reserve(id){

const type = prompt("solo / duo / trio")

const userId = prompt("twoje id użytkownika")

const res = await fetch("/api/reservations/reserve",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
slotId:id,
type:type,
userId:userId
})

})

const data = await res.json()

alert("PIN rezerwacji: "+data.pin)

}

loadSlots()
