import React from 'react'
import Maincomp from "./components/Maincomp"
import Login from "./components/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import ResumeAnalysis from "./components/ResumeAnalysis";
import History from './components/History'
import Profile from './components/Profile'
import Home from './components/Home'

const App = () => {
  return (

    <BrowserRouter>
 <Routes>

    <Route path="/" element={<Maincomp/>}/>
   
<Route path='/login' element={<Login/>} />
<Route path='/home' element={<Home/>}/>

<Route path='/signup' element={<Signup/>}/>
<Route path='/history' element={<History/>}/>
<Route path='/profile' element={<Profile/>}/>
<Route
    path="/resumeanalysis"
 element={<ResumeAnalysis/>}/>

 </Routes>
</BrowserRouter>
  )
}

export default App