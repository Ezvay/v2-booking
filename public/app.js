const socket=io()

let bookings={}
let stats={}
let selectedDay=null

socket.on("init",(data)=>{

bookings=data.bookings
stats=data.stats

updateStats()

})

socket.on("update",(data)=>{

bookings=data.bookings
stats=data.stats

updateStats()
renderSlots()

})

function updateStats(){

document.getElementById("statSM").innerText=stats.sm
document.getElementById("statYang").innerText=stats.yang

}
