"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizeBoard from "./QuizeBoard";
import LoadQuestions from "./LoadQuestions";

type Job = {
  _id: string;
  jobname: string;
};

export const YourPostedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [closedExam, setClosedExam] = useState(true);

  const findYourSavedJobs = async () => {
    try {
      const response = await axios.post("/api/yourSavedJobs");
      setJobs(response.data.savedJobs);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  useEffect(() => {
    findYourSavedJobs();
  },[])

  const handleOpenAndCloseExam = async (status: string) => {
  try {
    await axios.put("/api/quiz/closeAndOpenExam", {
      status: status,
      jobId: selectedJobId,
    });

    status === "closed" ? setClosedExam(true):setClosedExam(false);
  } catch (err: any) {
    console.error("❌ Failed to update exam status:", err.response?.data || err.message);
  }
};

  return (
    <div className="p-4 space-y-4">
     
   Select Jobs
      {jobs.length > 0 && (
        <select
          name="yourJobs"
          id="yourJobs"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">-- Select Job --</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.jobname}
            </option>
          ))}
        </select>
      )}
       <QuizeBoard jobId={selectedJobId} />
       <LoadQuestions jobId={selectedJobId}/>
      <button
          onClick={() => handleOpenAndCloseExam(closedExam ? "opened" : "closed")}
          className={`px-4 py-2 rounded text-white font-medium transition
            ${closedExam ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          {closedExam ? "Open" : "Close"}
      </button>


    </div>
  );
};
