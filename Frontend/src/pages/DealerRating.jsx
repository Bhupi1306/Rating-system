import { useEffect, useState } from 'react';
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";

const Shownlabels = [
    "Sales Turnover",
    "Service Time",
    "Customer Relations Index",
    "insuranceSettlement",
    "Finance Facilities",
    "Staff Training",
    "Staff Behaviour",
    "Following Esg Guidelines"
];

let labels = []

let departments = [
  "Select Department", // Default option
];

export default function DealerRating() {
  const [ratings, setRatings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [Id, setId] = useState('');
  const [name, setName] = useState('');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


    const salesTurnover = <>
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
    <h4 className="text-md font-semibold text-gray-700 mb-2">Sales Turnover</h4>
    <div className="flex justify-between max-w-sm">
      {["0-50", "50-200", "200+"].map((num) => (
        <label
          key={num}
          className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
            ${ratings["salesTurnover"] === String(num)
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
        >
          <input
            type="radio"
            name={"Sales Turnover"}
            value={num}
            checked={ratings["Sales Turnover"] === String(num)}
            onChange={(e) => handleRateChange("salesTurnover", e.target.value)}
            className="hidden"
          />
          {num}
        </label>
      ))}
        {/* <label
          key={0}
          className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
            ${ratings[label] === String(0)
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
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
        </label> */}

    </div>
  </div>
</>


  // useEffect to fetch data as soon as the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/dealer/label/rating');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const{dealerRatingLabels, shownDepartments} = await response.json(); 
        labels = dealerRatingLabels  // "productivity","worksEthics","professionalism","learningAbility",
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







  const handleDealerList = async (department) => {

    if (department !== 'Select Department') {
      

      try {
        const url = "http://localhost:8000/dealer/rate"
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({department})
          })

      const result = await response.json()
      const dealers = result.dealer  

      setRatings({})
      if(dealers.length != 0)
      {
        setCardVisible(false)
        setFormVisible(true)
        setId(dealers[0]?.id)
        setName(dealers[0]?.fullName)
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
    console.log(e.target.value)
    const department = e.target.value;
    setSelectedDepartment(department);

    // Show form if a department is selected
    handleDealerList(department)
   
  };


  const handleRateChange = (label, value) => {
    setRatings((prev) => ({ ...prev, [label]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = labels.every(key => key in ratings)
    if(!isValid) {
      handleError("All fields are required")
    }else{

      const curMonth = new Date().toLocaleString("default",{month: "long"})
      const year = new Date().getFullYear()
      const monthYear = curMonth + year

      const id = Id
  
      console.log(id)
      try {
        const url = "http://localhost:8000/dealer/rate/submit"
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({id,ratings, monthYear})
          })

      const result = await response.json()
      console.log(result)

      handleDealerList(selectedDepartment)
      } catch (error) {
        
      }
      
    }
  };


  const getRating = async () =>
  {
    try {
      const url = "http://localhost:8000/dealer/download/rating"
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({selectedDepartment})
          })


      if(!response.ok) throw new Error("Failed to download")

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', `${selectedDepartment}_dealer_ratings.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
      handleError("Something went wrong")
    }
  }


  let tempRating = labels.slice()
  let tempShownLables = Shownlabels.slice()

  tempRating.splice(0,1)
  tempShownLables.splice(0,1)



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

      {/* Dealer Info Card */}
      {formVisible && (
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Dealer Information</h3>
          <div className="mt-4">
            <p><strong>Dealer ID:</strong> {Id}</p>
            <p><strong>Dealer Name:</strong> {name}</p>
          </div>
        </div>
      )}

      {/* Form shown only if a department is selected */}
      {formVisible && (
        <form onSubmit={handleSubmit}>
          {salesTurnover}
          {tempRating.map((label, index) => (
            <div key={label} className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">{tempShownLables[index]}</h4>
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
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
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
        <p className="text-gray-600 mb-6">
          Download the file below.
        </p>
        <button
        onClick={getRating}
        className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Download
        </button>
      </div>
      )}
      <ToastContainer/>
    </div>
  );
}
