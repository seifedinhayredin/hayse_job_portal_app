"use client"
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import LoadJob from './LoadJob'

interface Item{
    jobname:string;
    qualification:string;
    experiance:string;
    status:string;
    description:string;
    id:number;
    _id:string;
}

const DisplayJobs = () => {
    const[jobData,setjobData] =useState<Item[]>([]);

    const fetchJob = async() =>{
    const response = await axios('/api/jobsdisplay');
    setjobData(response.data.savedJobs)

  }

    useEffect(()=>{
            fetchJob();
        },[]
        )
 
  //console.log("jobData",jobData);
 
  const applyJob = (ids:any) => {
      console.log("Applied");
  }

  return (
<div>
    

           {
            
                jobData.map((item,index) => {
                    
                    return <LoadJob key={index} id = {index} jobname = {item.jobname} qualification = {item.qualification} experiance = {item.experiance} status = {item.status} description = {item.description} mongoId = {item._id} applyJob ={applyJob}/>
                }
                )
            }
    
</div>
  )
}

export default DisplayJobs