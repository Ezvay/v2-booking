require("dotenv").config()

const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/reservations",reservationRoutes)
app.use("/api/admin",adminRoutes)

app.get("/",(req,res)=>{
 res.send("V2 Booking API")
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>console.log("Server running"))
