import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Rating from './pages/rating'
import AddEmployee from './pages/AddEmployee'
import RefreshHandler from './components/refresehHandler'
import './App.css'
import "react-toastify/ReactToastify.css"
import DeleteEmployee from './pages/DeleteEmployee'
// import {isAdmin} from './pages/Login'

function App() {
  
  const[isAuthenticated, setIsAuthenticated] = useState(false)


  const AdminRoute = ({element}) => 
    {
     return isAdmin? element: <Navigate to="/rating" />
    }


  const PrivateRoute = ({element}) => {
    return isAuthenticated? element:  <Navigate to="/login" />
  }

  return (
    <>
      {/* < RefreshHandler setIsAuthenticated={setIsAuthenticated}/> */}
      <Routes>
        <Route path='/' element={<Navigate To="/login"/>} />
        {/* <Route path='/register' element={<PrivateRoute element={<Rating/>}/>} /> */}
        <Route path='/login' element={<Login />} />
        {/* <Route path='/rating' element={<PrivateRoute element={<Rating/>}/>} /> */}
        <Route path='/rating' element={<Rating/> }/>
        <Route path='/register' element={<Register/> }/>
        <Route path='/add' element={<AddEmployee/>} />
        <Route path='/remove' element={<DeleteEmployee/>} />
      </Routes>
    </>
  )
}

export default App
