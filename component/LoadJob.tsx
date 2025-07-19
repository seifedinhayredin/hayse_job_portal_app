import React, { useEffect, useState } from 'react'
import axios from 'axios';
interface componentProps{
    employerName:string;
    jobname:string;
    qualification:string;
    experiance:string;
    status:string;
    address:string;
    description:string;
    deadline:Date;
    postedAt:Date;
    id:number;
    _id:string;
    mongoId:string;
    applyJob:any;
}


const LoadJob: React.FC<componentProps> = ({ employerName,jobname, qualification, experiance, status,address, description,deadline,postedAt,mongoId,applyJob }) => {
    const[hasApplied, setHasApplied] = useState(false);

    const  isClosed = new Date() >new Date(deadline) ? true:false;

    const checkApliedOrNot = async() => {

     const response =  await axios.post("api/checkAppliedJob",{
        "JobId":mongoId
      })
      setHasApplied(response.data.checkApplication);
      
    }
    useEffect(() =>{
      checkApliedOrNot()
    },[])

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto mb-6 hover:shadow-lg transition-shadow duration-300">
       
        <div className="flex items-center justify-between w-full px-2 py-1 mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Job Title</p>
          <h1 className="text-xl font-bold text-gray-900">{jobname}</h1>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Employer</p>
          <h2 className="text-xl font-bold text-blue-700">{employerName}</h2>
        </div>
      </div>




      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Qualification:</span> {qualification}
      </div>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Experience:</span> {experiance}
      </div>

      <div  className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Status:</span> {status}
        
      </div>

      <div  className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Address:</span> {address}
        
      </div>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Deadline:</span>  {new Date(deadline).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}

      </div>
        <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Posted at:</span>  {new Date(postedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </div>

       <p className="font-medium">Job Description:</p>
      <p className="text-gray-700 text-sm">{description}</p>

 
       {
  isClosed ? (
    <div className="flex justify-end">
      <button className="bg-red-700 text-white px-5 py-2 rounded-lg transition duration-200 shadow">
        Closed
      </button>
    </div>
  ) : hasApplied ? (
    <div className="flex justify-end">
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow"
        onClick={() => applyJob(mongoId)}
      >
        Apply
      </button>
    </div>
  ) : (
    <div className="flex justify-end">
      <button
        disabled
        className="bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed shadow"
      >
        ✅ Applied
      </button>
    </div>
  )
}


</div>
  )
};

export default LoadJob;
