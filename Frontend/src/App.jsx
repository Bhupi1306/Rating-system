import { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider, Routes, useLocation, useNavigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Rating from './pages/Rating'
import './App.css'
import "react-toastify/ReactToastify.css"
import EmployeeLogin from './pages/employeeLogin'
import Layout from './layout'
import { isTokenValid } from './components/JwtChecker'
import { DeleteDealer, DeleteEmployee, DeleteSupplier } from './pages/Delete'
import { AddDealer, AddEmployee, AddSupplier } from './pages/Add'
import DealerRating from './pages/DealerRating'
import SupplierRating from './pages/SupplierRating'
import Admin from './pages/Admin'
import {FeedbackForm} from './pages/Employee/feedbackForm'
import Home from './pages/Home'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // initial loading state is true

  // Token validation & setting isAuthenticated
  useEffect(() => {
    console.log("useEffect running..."); // Debug: Check if useEffect is running
    const token = localStorage.getItem('token');
    
    if (token && isTokenValid(token)) {
      console.log("Token is valid, setting isAuthenticated to true.");
      setIsAuthenticated(true);
    } else {
      console.log("No valid token, setting isAuthenticated to false.");
      setIsAuthenticated(false);
    }

    // After checking token, set loading to false
    setLoading(false); 
  }, []);  // empty dependency array to run only once when the app loads

  // Ensure that the layout doesn't render until the `loading` state is set to false
  if (loading) {
    console.log("Loading... still waiting for token check.");
    return <div>Loading...</div>;  // Show loading screen until state is updated
  }

  const PrivateRoute = () => {
    console.log("User is authenticated:", isAuthenticated); // Debug: Check authenticated status

    if (isAuthenticated) {
      console.log("User is authenticated, showing private routes.");
      return <Outlet />;
    }
    else {
      console.log("User is not authenticated, redirecting to login.");
      return <Navigate to="/" />;
    }
  };


  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        
        {/* Public Routes */}
        <Route path="" element={<Home/>} />
        <Route path="home" element={<Home/>} />
        <Route path="rating/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="feedback/login" element={<EmployeeLogin />} />
        <Route path="feedback/form" element={<FeedbackForm />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="admin" element={<Admin />} />
          <Route path="register" element={<Register />} />
          <Route path="rating" element={<Rating />} />
          <Route path="add" element={<AddEmployee />} />
          <Route path="remove" element={<DeleteEmployee />} />



          <Route path="dealer/add" element={<AddDealer />} />
          <Route path="dealer/rating" element={<DealerRating />} />
          <Route path="dealer/remove" element={<DeleteDealer />} />

          
          <Route path="supplier/rating" element={<SupplierRating />} />
          <Route path="supplier/add" element={<AddSupplier />} />
          <Route path="supplier/remove" element={<DeleteSupplier />} />
        </Route>



      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

