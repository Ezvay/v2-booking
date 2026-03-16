import {useEffect,useState} from "react"
import {api} from "../api"
import SlotCard from "../components/SlotCard"

export default function Calendar(){

 const [slots,setSlots] = useState([])

 useEffect(()=>{
 api.get("/reservations/slots")
 .then(res=>setSlots(res.data))
 },[])

 return(

 <div className="calendar">

 <h1>V2 EXP Booking</h1>

 {slots.map(s=>(
 <SlotCard key={s.id} slot={s}/>
 ))}

 </div>

 )

}
