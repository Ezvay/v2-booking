let reservations=[]
let locked=[]

async function load(){

 const r=await fetch("/api/reservations")
 reservations=await r.json()

 const l=await fetch("/api/locked")
 locked=await l.json()

 calendar()

}

function calendar(){

 const cal=document.getElementById("calendar")

 cal.innerHTML=""

 for(let i=0;i<30;i++){

  const d=new Date()
  d.setDate(d.getDate()+i)

  const date=d.toISOString().split("T")[0]

  const div=document.createElement("div")
  div.className="day"
  div.innerText=date

  div.onclick=()=>show(date)

  cal.appendChild(div)

 }

}

function show(date){

 document.getElementById("selectedDay").innerText=date

 const container=document.getElementById("slots")
 container.innerHTML=""

 for(let h=0;h<24;h++){

  const r=reservations.find(x=>x.date==date && x.hour==h)

  const div=document.createElement("div")
  div.className="slot"

  if(!r){

   div.innerHTML=`
   ${h}:00
   <button onclick="reserve('${date}',${h},'solo')">SOLO</button>
   <button onclick="reserve('${date}',${h},'duo')">DUO</button>
   <button onclick="reserve('${date}',${h},'trio')">TRIO</button>
   `

  }else{

   div.innerHTML=`
   ${h}:00
   ${r.type} (${r.players.length}) PIN:${r.pin}
   `

  }

  container.appendChild(div)

 }

}

async function reserve(date,hour,type){

 const nick=prompt("Twój nick")

 const r=await fetch("/api/reserve",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({date,hour,type,nick})
 })

 const data=await r.json()

 alert("PIN rezerwacji: "+data.pin)

 load()

}

async function sendMsg(){

 const text=document.getElementById("msg").value

 await fetch("/api/messages",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({text})
 })

 alert("wysłano")

}

load()
