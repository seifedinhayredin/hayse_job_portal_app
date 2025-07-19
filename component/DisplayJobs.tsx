"use client"
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import LoadJob from './LoadJob'
import {ToastContainer, toast } from 'react-toastify'

interface Item{
   employerName:string;
    jobname:string;
    qualification:string;
    experiance:string;
    status:string;
    address:string;
    description:string;
    deadline:Date;
    postedAt:Date;
    createdAt:Date;
    id:number;
    _id:string;
     mongoId: string;
}

const DisplayJobs = () => {
  const [formData,setFormData] = useState({
    search:"",
    experiance:""});
    const[jobData,setjobData] =useState<Item[]>([]);
    const[error,setError] = useState("");

    const fetchJob = async() =>{
    const response = await axios('/api/jobsdisplay');
    setjobData(response.data.savedJobs)

  }

    useEffect(()=>{
            fetchJob();
        },[]
        )
 
  //console.log("jobData",jobData);
 
  const applyJob = async(ids:any) => {
    const confirmed = window.confirm("Are you sure you want to apply to this job?");
      if (!confirmed) return;


    const applied = await axios.post("api/applyToJob",{
      jobId:ids
    })
    if(applied)
    {
      toast.success("Successfully Applied");
       console.log("Applied: ",ids);
    }
    else{
      toast.error("Error when applying to Job");
    }
     
  }

  const handleFormChange = (e:any) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => {
      return {
        ...data,
        [name]:value
      }
    })

  }
  //console.log(formData);

 const searchJobs = async (e: any) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/searchjob", {
      keyword: formData.search,
    });
    const jobs = response.data.searchedJob;
    setjobData(response.data.searchedJob);
      
    if (jobs.length === 0) {
      setError("Sorry! Such Job is not found in our platform. Try again later!");
    } else {
      setError("");
  } 
}
  catch (error) {
    console.error("Search API failed:", error);
  }
};

const filterJobs = async (e: any) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/filterjob",{
      
      experiance: formData.experiance,
    });
    const jobs = response.data.filteredJob;
    setjobData(response.data.filteredJob);
      
    if (jobs.length === 0) {
      setError("Sorry! Such Job is not found in our platform. Try again later!");
    } else {
      setError("");
  } 
}
  catch (error) {
    console.error("Search API failed:", error);
  }
};




  return (
<div>
   <ToastContainer theme="dark"/>
  <div>
                        <form
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white p-4 rounded-xl shadow-md w-full max-w-2xl mx-auto my-6"
                  onSubmit={searchJobs}
                >
                  <input
                    type="text"
                    name="search"
                    placeholder="Search jobs..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleFormChange}
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Search
                  </button>

                  <div className="flex items-center gap-2">
                    <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                      Filter:
                    </label>
                    <select
                      name="experiance"
                      id="filter"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleFormChange}
                      onClick={filterJobs}
                    >
                      <option value="">All</option>
                      <option value="1-3">1-3</option>
                      <option value="4-5">4-5</option>
                      <option value="above 5">Above 5</option>
                    </select>
                  </div>
                </form>

         
                <p className="text-red-600 text-sm text-center mt-2">{error}</p>
              
        

           {
            
                jobData.map((item,index) => {
                    
                    return <LoadJob key={index} id = {index}  _id={item._id} 
                  employerName = {item.employerName}  jobname = {item.jobname} qualification = {item.qualification} 
                     experiance = {item.experiance} status = {item.status} 
                    address = {item.address} description = {item.description}
                      deadline = {item.deadline} postedAt={item.createdAt}
                       mongoId = {item._id} applyJob ={applyJob}/>
                }
                )
            }
    </div>
</div>
  )
}

export default DisplayJobs