let reservations=[]

async function load(){

 const r=await fetch("/api/reservations")
 reservations=await r.json()

 createCalendar()

}

function createCalendar(){

 const cal=document.getElementById("calendar")
 cal.innerHTML=""

 for(let i=0;i<30;i++){

  const d=new Date()
  d.setDate(d.getDate()+i)

  const date=d.toISOString().split("T")[0]

  const div=document.createElement("div")
  div.className="day"
  div.innerText=date

  div.onclick=()=>showSlots(date)

  cal.appendChild(div)

 }

}

function showSlots(date){

 document.getElementById("selectedDay").innerText=date

 const container=document.getElementById("slots")
 container.innerHTML=""

 for(let h=0;h<24;h++){

  const r=reservations.find(x=>x.date==date && x.hour==h)

  const div=document.createElement("div")
  div.className="slot"

  if(!r){

   div.classList.add("free")

   div.innerHTML=`
   <h3>${h}:00</h3>

   <input id="nick${h}" placeholder="nick">
   <input id="pin${h}" placeholder="pin">

   <button onclick="reserve('${date}',${h},'solo')">SOLO</button>
   <button onclick="reserve('${date}',${h},'duo')">DUO</button>
   <button onclick="reserve('${date}',${h},'trio')">TRIO</button>
   `

  }else{

   let limit=1
   if(r.type==="duo") limit=2
   if(r.type==="trio") limit=3

   let join=""

   if(r.players.length < limit){

    join=`
    <input id="join${h}" placeholder="nick">
    <button onclick="join('${date}',${h})">DOŁĄCZ</button>
    `

   }

   div.classList.add("taken")

   div.innerHTML=`
   <h3>${h}:00</h3>
   ${r.type.toUpperCase()} (${r.players.length}/${limit})<br>
   ${r.players.join(", ")}
   <br>
   ${join}
   `

  }

  container.appendChild(div)

 }

}

async function reserve(date,hour,type){

 const nick=document.getElementById("nick"+hour).value
 const pin=document.getElementById("pin"+hour).value

 await fetch("/api/reserve",{

  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({date,hour,type,nick,pin})

 })

 load()

}

async function join(date,hour){

 const nick=document.getElementById("join"+hour).value

 await fetch("/api/reserve",{

  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({date,hour,nick})

 })

 load()

}

load()
