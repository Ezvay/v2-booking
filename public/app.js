const socket=io()

let selectedDay=null
let user=null

function login(){

 fetch("/login",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   nick:document.getElementById("nick").value,
   password:document.getElementById("password").value
  })
 })
 .then(r=>r.json())
 .then(data=>{
  if(data.ok){
   user=data.user
   alert("Zalogowano")
  }
 })

}

function buildCalendar(){

 const cal=document.getElementById("calendar")

 const date=new Date()

 const year=date.getFullYear()
 const month=date.getMonth()

 const days=new Date(year,month+1,0).getDate()

 for(let i=1;i<=days;i++){

  const d=document.createElement("div")
  d.className="day"
  d.innerText=i

  const iso=`${year}-${month+1}-${i}`

  d.onclick=()=>{

   selectedDay=iso

   renderSlots()

  }

  cal.appendChild(d)

 }

}

function renderSlots(){

 const container=document.getElementById("slots")

 container.innerHTML=""

 for(let h=0;h<24;h++){

  const time=String(h).padStart(2,"0")+":00"

  const div=document.createElement("div")
  div.className="slot"

  div.innerHTML=`

  <b>${time}</b>

  <button onclick="book('${time}',1)">Solo</button>
  <button onclick="book('${time}',2)">Party2</button>
  <button onclick="book('${time}',3)">Party3</button>

  `

  container.appendChild(div)

 }

}

function book(time,type){

 socket.emit("book",{
  day:selectedDay,
  time,
  nick:user.nick,
  type
 })

}

buildCalendar()
