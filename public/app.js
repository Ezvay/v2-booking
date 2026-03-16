const socket=io()

let user=null
let selectedDay=null

function login(){

fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
nick:nick.value,
password:pass.value
})
})
.then(r=>r.json())
.then(d=>{

if(d.ok){

user=d.user

buildCalendar()

socket.emit("getData")

}

})

}

function register(){

fetch("/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
nick:regNick.value,
email:regEmail.value,
password:regPass.value
})
})

}

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
renderSlots()
}

cal.appendChild(d)

}

}

function renderSlots(){

const slots=document.getElementById("slots")

slots.innerHTML=""

for(let h=0;h<24;h++){

let time=String(h).padStart(2,"0")+":00"

let div=document.createElement("div")
div.className="slot"

div.innerHTML=`
<b>${time}</b>

<button onclick="book('${time}',1)">Solo</button>
<button onclick="book('${time}',2)">Party2</button>
<button onclick="book('${time}',3)">Party3</button>
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
