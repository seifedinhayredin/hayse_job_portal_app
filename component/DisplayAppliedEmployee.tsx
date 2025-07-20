"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Briefcase, User, Mail } from "lucide-react";
import Image from "next/image"; // from next/image
import { groupByJob } from '@/utils/groupByJob';



export const DisplayAppliedEmployee = () => {
    const [employeeData,setEmployeeData] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);


    const fetchJobsForEmployeers = async() =>{
      const response =   await axios.post("api/displayAppliedJobSeekers");
      console.log("API Response:", response.data);
      setEmployeeData(response.data.applications)
      setHasFetched(true);
       

    }

    useEffect(() => {
  console.log("Updated employeeData:", employeeData);
   }, [employeeData]);

    //console.log("Employee Data: ",employeeData);
    console.log("EmployeeData length check: ", employeeData.length);

     
    // Group by jobname
  const groupedData = groupByJob(employeeData);

 return (
  <div className="p-4 space-y-6 max-w-4xl mx-auto">
    <button
      onClick={fetchJobsForEmployeers}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
    >
      Fetch Applicants
    </button>

    {hasFetched && employeeData.length === 0 ? (
      <div className="text-gray-500 text-center">No applicants found yet.</div>
    ) : (
      Object.entries(groupedData).map(([jobname, applicants]) => (
        <div key={jobname} className="bg-gray-50 p-4 rounded-lg shadow space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-blue-700">
            Applicants for: {jobname}
          </h2>

          {applicants.map((data: any, index: number) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 sm:p-5 border border-gray-200 flex flex-col sm:flex-row gap-4 items-center sm:items-start"
            >
              {data.applicant?.image ? (
                <Image
                  src={data.applicant.image}
                  alt="Applicant Image"
                  width={64}
                  height={64}
                  className="rounded-full object-cover border shadow w-16 h-16"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}

              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-gray-700">
                  <span className="flex items-center gap-1">
                    <User className="text-green-500 w-4 h-4" />
                    <span className="font-semibold">Applicant:</span>
                  </span>
                  <span>
                    {data.applicant?.firstname} {data.applicant?.lastname}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-gray-700">
                  <span className="flex items-center gap-1">
                    <Mail className="text-yellow-500 w-4 h-4" />
                    <span className="font-semibold">Email:</span>
                  </span>
                  <span className="break-all">{data.applicant?.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))
    )}
  </div>
);


}



 

  
