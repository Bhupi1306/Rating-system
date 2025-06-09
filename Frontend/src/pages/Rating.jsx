import { useEffect, useState } from 'react';
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import Navbar from '../components/Navbar';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Shownlabels = [
  "Productivity",
  "Works Ethics",
  "Professionalism",
  "Learning Ability",
  "Leadership",
  "Team Work",
  "Regularity/Attendance",
  "Confidence",
  "Team Building",
  "Growth Oriented",
  "Technical Knowledge",
  "Company-Personal Goals Compatibility",
  "Employees Well Being",
  "Employee Health"
];

let labels = []

let departments = [
  "Select Department", // Default option
];

export default function Rating() {
  const [ratings, setRatings] = useState({});
  const [finalRatings, setfinalRatings] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);






  // useEffect to fetch data as soon as the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}employee/label/rating`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const{ratingLabels, shownDepartments} = await response.json(); 
        labels = ratingLabels  // "productivity","worksEthics","professionalism","learningAbility",
        shownDepartments.forEach((dept,index) => {departments[index + 1] = dept})
        if(labels.length != Shownlabels.length)
        {
          throw new Error("Check the number of fields to be reviewed")
        }

        





      } catch (err) {
        setError(err.message);  // Handle any errors that occur during the fetch
      } finally {
        setLoading(false);  // Set loading state to false after fetching data
      }
    };

    fetchData();  // Trigger the fetch as soon as the component loads
  }, []);  // Empty dependency array means this effect runs only once when the component mounts


  // Show loading or error messages if needed
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  


  
  
  const handleEmployeeList = async (department) => {
    
    if (department !== 'Select Department') {
      

      try {
        const url = `${API_BASE_URL}employee/rate`
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({department})
          })

      const result = await response.json()
      const employees = result.employee  

      setRatings({})
      if(employees.length != 0)
      {
        setCardVisible(false)
        setFormVisible(true)
        setEmployeeId(employees[0]?.id)
        setEmployeeName(employees[0]?.fullName)
      } 
      else {
        setFormVisible(false)
        setCardVisible(true)
      }
    }
    
    
    catch (error) {
        handleRateChange("something went wrong")
      }
    } else {
      setFormVisible(false);
      setCardVisible(false)
    }
  }


  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    // Show form if a department is selected
    handleEmployeeList(department)
   
  };


  const handleRateChange = (label, value) => {
    setRatings((prev) => {
      const updatedRating = {...prev, [label]: value}
      // console.log(updatedRating)
      // return { ...prev, [label]: value };
      return updatedRating
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Shownlabels.every(key => key in ratings && ratings[key]>=0 && ratings[key]<=5)
    if(!isValid) {
      handleError("All fields are required")
    }else{

      const curMonth = new Date().toLocaleString("default",{month: "long"})
      const year = new Date().getFullYear()
      const monthYear = curMonth + year

      const id = employeeId
      console.log(ratings)
  

      try {
        const url = `${API_BASE_URL}employee/rate/submit`
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({id,ratings, monthYear, department:selectedDepartment, name:employeeName })
          })

      const result = await response.json()
      console.log(result)

      handleEmployeeList(selectedDepartment)
      window.scroll({
        top:0,
        behavior: "smooth"
      })
      } catch (error) {
        handleError(error)
      }
      
    }
  };


  // const getEmployeeRating = async () =>
  // {
  //   try {
  //     const url = `${API_BASE_URL}employee/download/rating`
  //       const response = await fetch(url, {
  //             method: "POST",
  //             headers: {
  //               'content-type':'application/json'
  //             },
  //           body: JSON.stringify({selectedDepartment})
  //         })


  //     if(!response.ok) throw new Error("Failed to download")

  //       const blob = await response.blob();
  //       const urlBlob = window.URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = urlBlob;
  //       link.setAttribute('download', `${selectedDepartment}_ratings.csv`);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();

  //   } catch (error) {
  //     handleError("Something went wrong")
  //   }
  // }

  const getEmployeeRating = () => {
    // This will open the Google Sheets link in a new tab
    window.open(`https://docs.google.com/spreadsheets/d/1QjvO9Yf8OJX3LAiTqjCfhfGHIbf59vKcDDYL-gcvOtY/edit?gid=0#gid=0`, '_blank');
  }






  return (
    <>
    <Navbar />
    <div className="max-w-3xl mx-auto p-8 space-y-8 bg-white shadow-xl rounded-2xl">
      {/* Department Dropdown */}
      <div className="mb-6">
        <label htmlFor="department" className="block text-md font-semibold text-gray-700">Select Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="w-full p-2 border rounded-lg mt-2"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Employee Info Card */}
      {formVisible && (
        <div className="bg-indigo-50 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Employee Information</h3>
          <div className="mt-4">
            <p><strong>Employee ID:</strong> {employeeId}</p>
            <p><strong>Employee Name:</strong> {employeeName}</p>
          </div>
        </div>
      )}

      {/* Form shown only if a department is selected */}
      {formVisible && (
        <form onSubmit={handleSubmit}>
          {Shownlabels.map((label, index) => (
            <div key={label} className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">{Shownlabels[index]}</h4>
              <div className="flex justify-between max-w-sm">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label
                    key={num}
                    className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
                      ${ratings[label] === String(num)
                        ? 'bg-indigo-500 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
                  >
                    <input
                      type="radio"
                      name={label}
                      value={num}
                      checked={ratings[label] == num}
                      onChange={(e) => handleRateChange(label, e.target.value)}
                      className="hidden"
                    />
                    {num}
                  </label>
                ))}
                  <label
                    key={0}
                    className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
                      ${ratings[label] === String(0)
                        ? 'bg-indigo-500 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
                  >
                    <input
                      type="radio"
                      name={label}
                      value={0}
                      checked={ratings[label] === String(0)}
                      onChange={(e) => handleRateChange(label, e.target.value)}
                      className="hidden"
                    />
                    N/A
                  </label>

              </div>
            </div>
          ))}

            <div>
                <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Next
                </button>
            </div>
        </form>
      )}

      {cardVisible && (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          No ratings left for this department
        </h2>
        <button
        onClick={getEmployeeRating}
        className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Go to sheets
        </button>
      </div>
      )}
      <ToastContainer/>
    </div>
    </>
  );
}
