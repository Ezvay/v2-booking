function buildCalendar(){

let cal=document.getElementById("calendar")
cal.innerHTML=""

let date=new Date()
let year=date.getFullYear()
let month=date.getMonth()

let days=new Date(year,month+1,0).getDate()

for(let i=1;i<=days;i++){

let d=document.createElement("div")
d.className="day"
d.innerText=i

let iso=year+"-"+String(month+1).padStart(2,"0")+"-"+String(i).padStart(2,"0")

d.onclick=()=>{

selectedDay=iso

document.querySelectorAll(".day").forEach(x=>x.classList.remove("active"))
d.classList.add("active")

renderSlots()

}

cal.appendChild(d)

}

}

buildCalendar()
