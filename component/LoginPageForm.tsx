"use client"
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
const LoginPage = () => {
    const[formData,setFormData] = useState({
        email:"",
        password:""
    });
const[error,setError] = useState("")

const router = useRouter();

    const handleChange = (e:any) =>{
           const {name,value} = e.target;

           setFormData((data) =>{
            return {
                ...data,
                [name]:value
            }
           })
    }
    //console.log(formData);

    const handleSubmit = async(e:any) =>{
      e.preventDefault();
      try {
        const {email,password} = formData;

        const res:any = await signIn("credentials",{
          email,
          password,
          redirect:false
        });

        if(!email || !password){
          setError("All fields are required");
          return;
        }
        
        if(res.error){
          setError("Invalid credentials");
          return;
        }
        router.replace("jobboard");
      } catch (error) {
        console.log("Error occured",error)
      }
       setFormData({email:"",password:""})
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 mt-4">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6" onSubmit={handleSubmit} >
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

             <button type='submit'
            className="w-full bg-blue-600 text-white py-2 px-4 round hover:bg-blue-700 transition"
            >Login</button>
             <div className="mt-4 text-sm text-center text-gray-600">
                <span>Not registered yet? </span>
                <a href="/register" className="text-blue-600 hover:underline font-medium">
                  Create an account
                </a>
            </div>


            <div className='text-red-500 py-2 px-4 round '>
              {error}
            </div>
        </form>

    </div>
  )
}

export default LoginPage