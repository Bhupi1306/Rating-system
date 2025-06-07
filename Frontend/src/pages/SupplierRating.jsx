import { useEffect, useState } from 'react';
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Shownlabels = [
    "Following Esg Guidelines",
    "Distance of Supplier Plant From Factory in Kilometers(Km)",
    "Delivery Period Efficiency",
    "Quality of Product",
    "Certification of Products",
    "Credit Facility by Supplier",
    "Innovation Ability",
    "Production Capacity",
    "Customer Support Index"
];

let labels = []

let departments = [
  "Select Department", // Default option
];

export default function SupplierRating() {
  const [ratings, setRatings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [Id, setId] = useState('');
  const [name, setName] = useState('');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);





  // useEffect to fetch data as soon as the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}supplier/label/rating`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const{supplierRatingLabels, shownDepartments} = await response.json(); 
        labels = supplierRatingLabels  // "productivity","worksEthics","professionalism","learningAbility",
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







  const handelSupplierList = async (department) => {

    if (department !== 'Select Department') {

      try {
        const url = `${API_BASE_URL}supplier/rate`
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({department})
          })

      const result = await response.json()
      const suppliers = result.supplier  

      setRatings({})
      if(suppliers.length != 0)
      {
        setCardVisible(false)
        setFormVisible(true)
        setId(suppliers[0]?.id)
        setName(suppliers[0]?.fullName)
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
    handelSupplierList(department)
   
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
        const url = `${API_BASE_URL}supplier/rate/submit`
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({id,ratings, monthYear})
          })

      const result = await response.json()
      console.log(result)

      handelSupplierList(selectedDepartment)
        window.scroll({
        top:0,
        behavior: "smooth"
      })
      } catch (error) {
        
      }
      
    }
  };


  // const getRating = async () =>
  // {
  //   try {
  //     const url = `${API_BASE_URL}supplier/download/rating`
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
  //       link.setAttribute('download', `${selectedDepartment}_dealer_ratings.csv`);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();

  //   } catch (error) {
  //     handleError("Something went wrong")
  //   }
  // }

  const getRating = () => {
    window.open(`https://docs.google.com/spreadsheets/d/1LdspoXQQjtBhoszOzhXb0M1gj1a6z4l8hvKXxZ2N8rE/edit?gid=0#gid=0`, '_blank');
  }







const labelFunc = (index, arr) => {
  return (
    <>
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
    <h4 className="text-md font-semibold text-gray-700 mb-2">{Shownlabels[index]}</h4>
    <div className="flex justify-between max-w-sm">
      {arr.map((num) => (
        <label
          key={num}
          className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
            ${ratings[`${labels[index]}`] === String(num)
              ? 'bg-indigo-500 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
        >
          <input
            type="radio"
            name={`${Shownlabels[index]}`}
            value={num}
            checked={ratings[`${Shownlabels[index]}`] === String(num)}
            onChange={(e) => handleRateChange(`${labels[index]}`, e.target.value)}
            className="hidden"
          />
          {num}
        </label>
      ))}
        <label
          key={0}
          className={`cursor-pointer px-2 py-0.3 rounded-full text-center transition-all duration-150
            ${ratings[`${labels[index]}`] === String(0)
              ? 'bg-indigo-500 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
        >
          <input
            type="radio"
            name={`${Shownlabels[index]}`}
            value={0}
            checked={ratings[`${Shownlabels[index]}`] === String(0)}
            onChange={(e) => handleRateChange(`${labels[index]}`, e.target.value)}
            className="hidden"
          />
          N/A
        </label>

    </div>
  </div>
    </>
  )


}



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
        <div className="bg-indigo-50 p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700">Dealer Information</h3>
          <div className="mt-4">
            <p><strong>Supplier ID:</strong> {Id}</p>
            <p><strong>Sup Name:</strong> {name}</p>
          </div>
        </div>
      )}

      {/* Form shown only if a department is selected */}
      {formVisible && (
        <form onSubmit={handleSubmit}>

          {labelFunc(0, ["Yes", "No"])}
          {labelFunc(1, ["0-100", "100-500", "500-1000", "1000+"])}
          {labelFunc(2, [1,2,3,4,5])}
          {labelFunc(3, [1,2,3,4,5])}
          {labelFunc(4, ["Yes", "No"])}
          {labelFunc(5, ["Yes", "No"])}
          {labelFunc(6, [1,2,3,4,5])}
          {labelFunc(7, [1,2,3,4,5])}
          {labelFunc(8, [1,2,3,4,5])}

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
        onClick={getRating}
        className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Go to sheets
        </button>
      </div>
      )}
      <ToastContainer/>
    </div>
  );
}
