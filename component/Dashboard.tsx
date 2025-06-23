"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
import JobAnalyticsGraph from './JobAnalyticsGraph';


const StatsCard = ({ title, count, color }: { title: string; count: number; color: string }) => (
  <div
    className={`w-32 h-32 flex flex-col items-center justify-center ${color} text-white font-semibold text-lg rounded-full shadow-lg transition duration-500`}
  >
    <p className="text-3xl font-bold">
      <CountUp start={1} end={count} duration={2} />
    </p>
    <p className="text-sm mt-1 text-center">{title}</p>
  </div>
);


 const Dashboard = () => {
    const[jobData,setJobData] = useState<number>(0);
    const[userData,setUserData] = useState<number>(0);
 
     const allDataAnalytics = async() =>{
        try {
            
            const response = await axios.post('/api/dashboard');
            setJobData(response.data.allJobs);
            setUserData(response.data.allUsers);

        } catch (error) {
            console.log("Error on fetching data to Dashboard");
            
        }
        
      
     }
     useEffect(() =>{
       allDataAnalytics();
     },[])
    

  return (
    <div>
            <div className="flex flex-wrap justify-center gap-6 my-6">
                <StatsCard title="Jobs" count={jobData} color="bg-blue-600" />
                <StatsCard title="Users" count={userData} color="bg-green-600" />
            </div>
        <div>
            <h1 className="text-2xl font-bold text-center mt-6">Dashboard Analytics</h1>
            <JobAnalyticsGraph />
        </div>
    </div>
   


  )
}

export default Dashboard;