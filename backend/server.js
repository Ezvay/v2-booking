const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const adminRoutes = require("./routes/adminRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/reservations",reservationRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/messages",messageRoutes)

app.get("/",(req,res)=>{
 res.send("V2 Booking API running")
})

app.listen(process.env.PORT || 3000,()=>{
 console.log("Server running")
})
