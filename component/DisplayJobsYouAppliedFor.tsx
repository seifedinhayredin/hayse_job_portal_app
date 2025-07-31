"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type JobType = {
  _id: string;
  jobname: string;
  description: string;
  employerName: string;
  deadline: string;
  applicationStatus?: string;
};

export const DisplayJobsYouAppliedFor = () => {
  const [jobs, setJobs] = useState<JobType[]>([]); // ✅ store jobs in state
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const loggedInUserId = session?.user?.id;

  const fetchYourAppliedJobs = async () => {
    if (!loggedInUserId) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/showYourAppliedJobs", {
        applicantId: loggedInUserId,
      });

      // ✅ Save jobs to state
      setJobs(res.data.jobsAppliedFor as JobType[]|| []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchYourAppliedJobs}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {loading ? "Loading..." : "Fetch Your Applications"}
      </button>

      {/* ✅ Display Jobs */}
      <div className="mt-4">
        {jobs.length === 0 && !loading && (
          <p className="text-gray-600">No jobs found.</p>
        )}

        {jobs.map((job, index) => (
          <div
            key={job._id || index}
            className="border p-4 mb-3 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold">{job.jobname}</h2>
            <p className="text-gray-700">{job.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Status:</strong> {job.applicationStatus || "Pending"}
            </p>
            <p className="text-sm">
              <strong>Employer:</strong> {job.employerName}
            </p>
            <p className="text-sm">
              <strong>Deadline:</strong>{" "}
              {new Date(job.deadline).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
