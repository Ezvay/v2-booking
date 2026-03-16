document.getElementById("adminBtn").onclick=()=>{

let pass=prompt("Admin password")

if(pass==="platforma"){
document.getElementById("adminPanel").style.display="block"
}

}

function adminBlockHour(){

let time=prompt("Godzina np 14:00")

socket.emit("blockHour",{password:"platforma",day:selectedDay,time})

}

function adminUnblockHour(){

let time=prompt("Godzina np 14:00")

socket.emit("unblockHour",{password:"platforma",day:selectedDay,time})

}

function adminBlockDay(){

socket.emit("blockDay",{password:"platforma",day:selectedDay})

}

function adminUnblockDay(){

socket.emit("unblockDay",{password:"platforma",day:selectedDay})

}
