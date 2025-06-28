"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

 export default function RegisterForm() {

  const[formData,setFormData] = useState({
    firstname:"",
    middlename:"",
    lastname:"",
    email:"",
    password:"",
    confirmpassword:"",
    role:"",
  })

  const [error, setError] = useState("")

  const router = useRouter();

  const handleChange = (e:any) =>{
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data)=> {
      return{
        ...data,
        [name]:value
      }
    }
  )
}
//console.log(formData)



const  handleSubmit = async(e:any) =>{
  e.preventDefault();


const {firstname,middlename,lastname,email,password,confirmpassword,role} = formData;

if(!firstname || !middlename ||!lastname|| !email || !password || !confirmpassword || !role){
  setError("All fields are required");
  return;
}

if(password != confirmpassword){
  setError("Password and Confirm password fields must be the same");
  return;
}



try {
  const {email} = formData;
  const userExistResponse = await axios.post('/api/userExist',{email});
  const { exists } = userExistResponse.data;
 
   if (exists) {
    setError("User is already exists");
    return;
  }




const response = await axios.post('/api/register',formData)

toast.success(response.data.msg);
setError("");


setFormData({firstname:"",
    middlename:"",
    lastname:"",
    email:"",
    password:"",
    confirmpassword:"",
    role:"",})

    router.replace("/login");

} catch (error) {
  toast.error('Error')
  console.log("Error occured while registering user ",error)
}
  
}

  return (
    <div>
      <ToastContainer theme='dark'/>
    <div className="min-h-screen flex items-center justify-center bg-gray-300 mt-4">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6" onSubmit={handleSubmit}>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="text" name = "firstname" id='firstname' placeholder='Enter your first name'
            value={formData.firstname}
            onChange={handleChange}
            />

            <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            type="text" name = "middlename" id='middlename' placeholder='Enter your middle name'
            value={formData.middlename}
            onChange={handleChange}

            />

            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             type="text" name = "lastname" id='lastname' placeholder='Enter your first name'
             value={formData.lastname}
             onChange={handleChange}
             />

            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            type="email" name="email" id="email" placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            />

            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="password" name='password' id='password' placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            />

            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
            className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            type="password" name='confirmpassword' id='confirmpassword' placeholder='Confirm your password' 
            value={formData.confirmpassword}
            onChange={handleChange}
            />

            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            
            <select name="role" id="role" onChange={handleChange}
             className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">--Select--</option>
              <option value="user">User</option>
              <option value="client">Client</option>
            </select>

            <button type='submit'
            className="w-full bg-blue-600 text-white py-2 px-4 round hover:bg-blue-700 transition"
            >Register</button>
            <div className='text-red-500 py-2 px-4 round '>
              {error}
            </div>

        </form>

        
    </div>
    
    </div>
  )
}
 
