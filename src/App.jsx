import {BrowserRouter,Routes,Route} from "react-router-dom"

import Calendar from "./pages/Calendar"
import Login from "./pages/Login"
import Register from "./pages/Register"

export default function App(){

 return(

 <BrowserRouter>

 <Routes>

 <Route path="/" element={<Calendar/>}/>
 <Route path="/login" element={<Login/>}/>
 <Route path="/register" element={<Register/>}/>

 </Routes>

 </BrowserRouter>

 )

}
