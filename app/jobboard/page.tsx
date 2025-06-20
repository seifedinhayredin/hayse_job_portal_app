import DisplayJobs from '@/component/DisplayJobs';
import React from 'react'

 const page = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-2 mx-8 my-2">Jobs looking for application: </h1>
      <DisplayJobs /></div>
  )
}
export default page;