import React from "react";
import logo from "../assets/Logo.jpg"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function TwoCardsCentered() {

    const navigate = useNavigate()

  const Card = ({ title, content, navigation }) => (
    <div id="home_card" className="bg-white rounded-2xl shadow-md p-6 w-64 max-w-sm hover:shadow-xl transition" onClick={() => navigate(navigation)}>
      <h2 id="home_card_title" className="text-xl font-semibold text-gray-800  mb-2 text-center">{title}</h2>
      <p id="home_card_content" className="text-gray-600 text-sm">{content}</p>
    </div>
  );


  return (
    <> 
    <Navbar />
    <div className="mt-40">
        <div className="w-screen flex items-center justify-center">
        <img
            src={logo} 
            alt="Logo"
            className="h-24 w-24 rounded-full object-cover"
        />
        </div>
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to SMG Connect</h1>
    </div>
    <div className="h-screen w-screen flex items-center justify-center -mt-70">
      <div className="flex flex-col md:flex-row  gap-8 w-full max-w-4xl justify-center items-center">
        <Card title="Annual Rating" content="Rating portal for Head of departments and Admin" navigation="/rating/login" />
        <Card title="Annual Survey" content="Feedback Portal for Employees, Dealers and Suppliers" navigation="/feedback/login" />
      </div>
    </div>
    </>
  );
}
