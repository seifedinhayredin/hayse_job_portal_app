"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface componentProps {
  employerName: string;
  jobname: string;
  qualification: string;
  experiance: string;
  status: string;
  address: string;
  description: string;
  deadline: Date;
  postedAt: Date;
  id: number;
  _id: string;
  mongoId: string;
  applyJob: (jobId: string) => void;
}

const LoadJob: React.FC<componentProps> = ({
  employerName,
  jobname,
  qualification,
  experiance,
  status,
  address,
  description,
  deadline,
  postedAt,
  mongoId,
  applyJob,
}) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [statusOfApplication, setStatusOfApplication] = useState("");
  const [expanded, setExpanded] = useState(false); // ✅ For See more/less

  const isClosed = new Date() > new Date(deadline);

  const fetchStatus = async () => {
    const response = await axios.post("/api/displayStatusofYourApplication", {
      jobId: mongoId,
    });
    setStatusOfApplication(response.data.statusofApplicant || "");
    setHasApplied(!!response.data.statusofApplicant);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleApply = async () => {
    try {
      await applyJob(mongoId);
      await fetchStatus();
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  const shortText =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto mb-6 hover:shadow-lg transition-shadow duration-300">
      {/* Job Info */}
      <div className="flex items-center justify-between w-full px-2 py-1 mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
            Job Title
          </p>
          <h1 className="text-xl font-bold text-gray-900">{jobname}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
            Employer
          </p>
          <h2 className="text-xl font-bold text-blue-700">{employerName}</h2>
        </div>
      </div>

      {/* Job Details */}
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Qualification:</span> {qualification}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Experience:</span> {experiance}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Status:</span> {status}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Address:</span> {address}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Deadline:</span>{" "}
        {new Date(deadline).toLocaleDateString()}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Posted at:</span>{" "}
        {new Date(postedAt).toLocaleDateString()}
      </div>

      {/* ✅ Description with See More */}
      <p className="font-medium mt-4">Job Description:</p>
      <p className="text-gray-700 text-sm">
        {expanded ? description : shortText}
        {description.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-blue-600 hover:underline text-sm"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </p>

      {/* Bottom Section */}
      <div
        className={`flex justify-between items-center mt-4 ${
          hasApplied ? "border-t pt-4" : ""
        }`}
      >
        {/* Status Badge */}
        {hasApplied && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              statusOfApplication === "accepted"
                ? "bg-green-100 text-green-800"
                : statusOfApplication === "reviewed"
                ? "bg-yellow-100 text-yellow-800"
                : statusOfApplication === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Status: {statusOfApplication || "pending"}
          </span>
        )}

        {/* Button */}
        <div className="ml-auto">
          {isClosed ? (
            <button
              className="bg-red-700 text-white px-5 py-2 rounded-lg shadow cursor-not-allowed"
              disabled
            >
              Closed
            </button>
          ) : hasApplied ? (
            <button
              disabled
              className="bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed shadow"
            >
              ✅ Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
            >
              📩 Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadJob;
