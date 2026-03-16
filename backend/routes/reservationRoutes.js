const router = require("express").Router()

const controller = require("../controllers/reservationController")
const auth = require("../middleware/auth")

router.get("/slots",controller.getSlots)
router.post("/create",auth,controller.createReservation)

module.exports = router
