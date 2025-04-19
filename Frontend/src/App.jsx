import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/login'
import Rating from './pages/rating'
import RefreshHandler from './components/refresehHandler'
import './App.css'
import "react-toastify/ReactToastify.css"

function App() {
  
  const[isAuthenticated, setIsAuthenticated] = useState(false)

  const PrivateRoute = ({element}) => {
    return isAuthenticated? element:  <Navigate to="/login" />
  }

  return (
    <>
      < RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path='/' element={<Navigate To="/login"/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/rating' element={<PrivateRoute element={<Rating/>}/>} />
      </Routes>
    </>
  )
}

export default App
