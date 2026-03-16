const socket=io()

let user=null
let selectedDay=null

function login(){

fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
nick:document.getElementById("nick").value,
password:document.getElementById("pass").value
})
})
.then(r=>r.json())
.then(data=>{

if(data.ok){

user=data.user

buildCalendar()

socket.emit("getBookings")

}

})

}

socket.on("bookings",(data)=>{

renderSlots(data)

})

function buildCalendar(){

const cal=document.getElementById("calendar")

const date=new Date()

const year=date.getFullYear()
const month=date.getMonth()

const days=new Date(year,month+1,0).getDate()

for(let i=1;i<=days;i++){

let d=document.createElement("div")

d.className="day"
d.innerText=i

let iso=`${year}-${month+1}-${i}`

d.onclick=()=>{

selectedDay=iso

socket.emit("getBookings")

}

cal.appendChild(d)

}

}

function renderSlots(bookings){

const slots=document.getElementById("slots")

slots.innerHTML=""

for(let h=0;h<24;h++){

let time=String(h).padStart(2,"0")+":00"

let div=document.createElement("div")

div.className="slot"

div.innerHTML=`
<b>${time}</b>

<button onclick="book('${time}',1)">solo</button>
<button onclick="book('${time}',2)">party2</button>
<button onclick="book('${time}',3)">party3</button>
`

slots.appendChild(div)

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
