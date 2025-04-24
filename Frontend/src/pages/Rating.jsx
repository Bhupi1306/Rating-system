import { useState } from 'react';
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";

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

const labels = [
  "productivity",
  "worksEthics",
  "professionalism",
  "learningAbility",
  "leadership",
  "teamWork",
  "attendance",
  "confidence",
  "teamBuilding",
  "growthOriented",
  "technicalKnowledge",
  "CPGC",
  "employeeWellBeing",
  "employeeHealth"
]

const departments = [
  "Select Department", // Default option
  "Dept1",
  "Dept2",
  "Dept3"
];

export default function Rating() {
  const [ratings, setRatings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState('12345');
  const [employeeName, setEmployeeName] = useState('John Doe');





  const handleDepartmentChange = async (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    // Show form if a department is selected
    if (department !== 'Select Department') {

      try {
        const url = "http://localhost:8000/employee/rate"
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({department})
          })

      const result = await response.json()
      const employees = result.employee  
      console.log(employees)
      if(employees.length != 0)
      {
        setFormVisible(true)
        setEmployeeId(employees[0]?.id)
        setEmployeeName(employees[0]?.fullName)
      } 
      else {
        setFormVisible(false)
      }
    }catch (error) {
        handleChange("something went wrong")
      }
    } else {
      setFormVisible(false);
    }
  };






  const handleChange = (label, value) => {
    setRatings((prev) => ({ ...prev, [label]: value }));
  };






  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = labels.every(key => key in ratings && ratings[key]>=1 && ratings[key]<=5)
    if(!isValid) {
      handleError("All fields are required")
    }else{

      const curMonth = new Date().toLocaleString("default",{month: "long"})
      const year = new Date().getFullYear()
      const monthYear = curMonth + year

      const id = employeeId
  

      try {
        const url = "http://localhost:8000/employee/rate/submit"
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({id,ratings, monthYear})
          })

      const result = await response.json()
      } catch (error) {
        
      }
      
    }
  };





  return (
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
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg mb-8">
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
          {labels.map((label, index) => (
            <div key={label} className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">{Shownlabels[index]}</h4>
              <div className="flex justify-between max-w-sm">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label
                    key={num}
                    className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
                      ${ratings[label] === String(num)
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                  >
                    <input
                      type="radio"
                      name={label}
                      value={num}
                      checked={ratings[label] === String(num)}
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="hidden"
                    />
                    {num}
                  </label>
                ))}
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
      <ToastContainer/>
    </div>
  );
}
