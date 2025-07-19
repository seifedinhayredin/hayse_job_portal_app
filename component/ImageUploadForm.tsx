"use client"
import { error } from 'console';
import React, { ChangeEvent, useState } from 'react'

export const ImageUploadForm = () => {
    const[image,setImage] = useState<File>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files){
            setImage(e.target.files[0])
        }

    }

    console.log("Image: ",image);

   const onSubmitHandler = () => {
       if(!image){
        alert("Please Insert Image");
        return;
       }

       const formData =  new FormData();
       formData.append("image",image);

       fetch('/api/upload-image',{
        method:"POST",

        body:formData
       }).then(response => {
        if(!response.ok){
            throw new Error("Response is not ok")
        }
        return response.json();
       });
   };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
    <div>
      <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">Select Image</label>
      <input
        type="file"
        accept='image/*'
        id="image"
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100 cursor-pointer"
        onChange={handleChange}
      />
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
    onClick={onSubmitHandler}
    >
      Upload Image
    </button>
  </form>
</div>

  )
}
