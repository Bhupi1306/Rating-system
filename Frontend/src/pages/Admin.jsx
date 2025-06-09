import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
    const navigate = useNavigate()
  const options = [
    {
      title: 'Employee',
      Add: "/add",
      Delete: "/remove",
      Rating: "/rating",
      feedback: "https://docs.google.com/spreadsheets/d/1u4IkNtv_bNd6lJYBPWLBeYlFD5ufmjd-exdiXS1R-kA/edit?gid=0#gid=0"
    },
    {
      title: 'Dealers',
      Add: "/dealer/add",
      Delete: "/dealer/remove",
      Rating: "/dealer/rating",
      feedback: "https://docs.google.com/spreadsheets/d/1LMvhIAGiK0CmWpEmfppRC35CCFZhdP-a3RS4DuRqPSQ/edit?gid=0#gid=0"
    },
    {
      title: 'Suppliers',
      Add: "/supplier/add",
      Delete: "/supplier/remove",
      Rating: "/supplier/rating",
      feedback: "https://docs.google.com/spreadsheets/d/1zrzoZ28nzet1Ed-fD6p8YjyRasy-JUBpmLb8rgHlcrw/edit?gid=0#gid=0"
    },
  ];


  const navigationHandler = (label,option, e) => {
    if (e.target.innerText === "Feedback") {
      window.open(option.feedback, '_blank');
    }
    else {
      navigate(option[label])
    }
  }


  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-start mt-8 justify-center bg-gradient-to-br px-4 py-12">
      <div className="grid gap-10 md:grid-cols-3 w-full max-w-6xl">
        {options.map((option) => (
          <div
            key={option.title}
            className="bg-white p-6 rounded-2xl border shadow-md hover:shadow-xl  transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Main Category Button */}
              <button
                className={`w-full text-lg font-semibold py-3 px-4 rounded-md border transform transition-all duration-200 text-indigo-600 border-indigo-200 hover:scale-[1.02]`}
              >
                {option.title}
              </button>

              {/* Sub Buttons */}
              <div className="flex flex-col gap-3 w-full mt-4">
                {['Add', 'Delete', 'Rating', 'Feedback'].map((label) => (
                  <button
                    key={label}
                    onClick={(e) => navigationHandler(label,option, e)}
                    className={`w-full py-2 rounded-md font-medium transition transform hover:scale-[1.01] bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
