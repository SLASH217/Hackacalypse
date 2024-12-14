import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Navbar from './component/Navbar'
import Map from './pages/Map'
import Communication from './pages/Communication'
import Trade from './pages/Trade'
const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/' element={<Dashboard/>}></Route>
      <Route path='/map' element={<Map/>}></Route>
      <Route path='/communication' element={<Communication/>}></Route>
      <Route path='/trade' element={<Trade/>}></Route>
    </Routes>
    </>
  )
}

export default App