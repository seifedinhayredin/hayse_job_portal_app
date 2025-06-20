import React from 'react'
interface componentProps{
    jobname:string;
    qualification:string;
    experiance:string;
    status:string;
    description:string;
    id:number;
    _id:string;
    mongoId:string;
    applyJob:any;
}


const LoadJob: React.FC<componentProps> = ({ jobname, qualification, experiance, status, description,mongoId,applyJob }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto mb-6 hover:shadow-lg transition-shadow duration-300">
       <h2 className="text-xl font-semibold text-gray-800 mb-2">{jobname}</h2>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Qualification:</span> {qualification}
      </div>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Experience:</span> {experiance}
      </div>

      <div  className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Status:</span> {status}
        
      </div>
       <p className="font-medium">Job Description:</p>
      <p className="text-gray-700 text-sm">{description}</p>

 
       
       <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow" onClick={() =>applyJob(mongoId)}>
          Apply
        </button>
      </div>


    </div>
  );
};

export default LoadJob;
