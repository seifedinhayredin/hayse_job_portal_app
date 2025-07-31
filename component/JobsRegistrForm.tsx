"use client"
import axios from 'axios'
import React, { useState } from 'react'
import {ToastContainer, toast } from 'react-toastify'

export const JobsRegistrForm = () => {

  const[formData,setFormData] =useState({
    employerName:"",
    jobname:"",
    qualification:"",
    experiance:"",
    status:"",
    address:"",
    description:"",
    deadline:""

  })
  const [error,setError] = useState("")

  const handleChange = (e:any) =>{
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => {
      return {
        ...data,
        [name]:value
      }
    })
  }
  

  const handleSubmit = async(e:any) =>{
        e.preventDefault();
        
        const {jobname,qualification,experiance,status, description} = formData;

        try {

          if(!jobname || !qualification ||!experiance || !status || !description){
              setError("All fields must be filled!");
              return;
          }

         const response =  await axios.post('/api/addjob',formData)

         
         if(response){
          toast.success(response.data.msg);
          setFormData({employerName:"",
                   jobname:"",
                    qualification:"",
                    experiance:"",
                    status:"",
                    address:"",
                    description:"",
                    deadline:""})
         };
         setError("");
         

        } catch (error) {
          
        }

  }

  
  return (
    <div>
      <ToastContainer theme="dark"/>
        <div className="min-h-screen flex items-center justify-center bg-gray-300 mt-4">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6" onSubmit={handleSubmit}>
           
            <label htmlFor="employerName" className="block text-sm font-medium text-gray-700">Employer Name</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="text" name = "employerName" id='employerName' placeholder='Enter name of the Employer'
            value={formData.employerName}
            onChange={handleChange}
            />
           
            <label htmlFor="jobname" className="block text-sm font-medium text-gray-700">Job Name</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="text" name = "jobname" id='jobname' placeholder='Enter name of the job'
            value={formData.jobname}
            onChange={handleChange}
            />

        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualification</label>
        <select id="qualification" name="qualification"  onChange={handleChange}
        className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        <option value="">--Select--</option>
        <option value="diploma">Diploma</option>
        <option value="degree">Degree</option>
        <option value="masters">Masters</option>
        <option value="phd">PHD</option>
        </select>

            <label htmlFor="experiance" className="block text-sm font-medium text-gray-700">Experiance</label>
           <select name="experiance" id="experiance" 
           onChange={handleChange}
           className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">--Select--</option>
            <option value="0">0</option>
            <option value="1-3">1-3</option>
            <option value="4-5">4-5</option>
            <option value="above 5">above 5</option>
           </select>

            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            
            <label className='px-4'>
                    <input type="radio" name="status" value="onsite" onChange={handleChange}/>
                    <span className='px-2'>On site </span>
                    </label>
                     <label className='px-4'>
                    <input type="radio" name="status" value="remote" onChange={handleChange}/>
                    <span className='px-2'>Remote </span>
                    </label>
                     <label>
                    <input type="radio" name="status" value="hybrid" onChange={handleChange}/>
                   <span className='px-2'>Hybrid</span>
              
                    </label>

                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address of the Job</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="text" name = "address" id='address' placeholder='Enter address of the job'
            value={formData.address}
            onChange={handleChange}
            />

              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-1">Job Description</label>
           
            <textarea name="description" id="description"
            className="mt-1 block w-full px-4 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={handleChange}
            ></textarea>

   <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="date" name = "deadline" id='deadline' 
            value={formData.deadline}
            onChange={handleChange}
            />


            <button type='submit'
            className="w-full bg-blue-600 text-white py-2 px-4 round hover:bg-blue-700 transition"
            >Add Job</button>

            <div className='text-red-500 py-2 px-4 round '>
              {error}
            </div>
            </form>
            </div>
            </div>
  )
}
