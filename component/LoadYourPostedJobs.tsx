"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type JobProps = {
  jobname: string;
  qualification: string;
  experiance: string;
  status: string;
  description: string;
  address: string;
  employerName: string;
  deadline: Date;
};

const LoadYourPostedJobs = () => {
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchJobsPostedByYou = async () => {
    try {
      const response = await axios.post("/api/yourPostedJobs");
      setJobs(response.data.jobsData || []);
    } catch (error) {
      console.log("Error when displaying your posted job", error);
    }
  };

  useEffect(() => {
    fetchJobsPostedByYou();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((data, index) => {
            const isExpanded = expanded === index;
            const shortText =
              data.description.length > 100
                ? data.description.slice(0, 100) + "..."
                : data.description;

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-1">
                  {data.jobname}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Posted by: <span className="font-medium">{data.employerName}</span>
                </p>

                <div className="space-y-1 text-gray-700 mb-3 text-sm">
                  <p>
                    <span className="font-semibold">Qualification:</span>{" "}
                    {data.qualification}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {data.experiance}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {data.status}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {data.address}
                  </p>
                </div>

                <div className="text-gray-700 text-sm mb-3">
                  <span className="font-semibold">Description:</span>{" "}
                  {isExpanded ? data.description : shortText}
                  {data.description.length > 100 && (
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : index)
                      }
                      className="text-blue-600 ml-1 hover:underline"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                <p className="text-gray-500 text-xs">
                  Deadline:{" "}
                  {new Date(data.deadline).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoadYourPostedJobs;
