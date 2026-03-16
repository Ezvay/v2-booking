app.post("/api/reserve",(req,res)=>{

 const data = read("reservations.json")

 const existing = data.find(x =>
  x.date === req.body.date && x.hour === req.body.hour
 )

 if(existing){

  let limit = 1
  if(existing.type==="duo") limit=2
  if(existing.type==="trio") limit=3

  if(existing.players.length >= limit)
   return res.json({error:"slot full"})

  existing.players.push(req.body.nick)

  write("reservations.json",data)

  return res.json({ok:true})

 }

 const r={
  date:req.body.date,
  hour:req.body.hour,
  type:req.body.type,
  players:[req.body.nick],
  pin:req.body.pin
 }

 data.push(r)

 write("reservations.json",data)

 res.json({ok:true})

})
