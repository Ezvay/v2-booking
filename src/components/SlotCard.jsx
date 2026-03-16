import {motion} from "framer-motion"

export default function SlotCard({slot}){

 return(

 <motion.div
 className="slot"
 whileHover={{scale:1.05}}
 >

 {slot.date} {slot.hour}:00

 <button>Rezerwuj</button>

 </motion.div>

 )

}
