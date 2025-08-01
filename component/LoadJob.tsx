"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface componentProps {
  whoPosted: string;
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
  employerId: string;
  mongoId: string;
  applyJob: (jobId: string) => void;
}

const LoadJob: React.FC<componentProps> = ({
  whoPosted,
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
  employerId,
  applyJob,
}) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [statusOfApplication, setStatusOfApplication] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

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

  const handleChat = async (employerId: string) => {
    try {
      const res = await axios.post("/api/chat/conversations", {
        user1: loggedInUserId,
        user2: employerId,
      });
      const conversation = res.data;
      window.location.href = `/chat/${conversation._id}`;
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  const shortText =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-3xl mx-auto mb-6 hover:shadow-lg transition-shadow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase mb-1">Job Title</p>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">{jobname}</h1>
        </div>

        <div className="text-right space-y-2">
          <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
            <p className="text-xs text-gray-500 uppercase mb-0.5">Posted by</p>
            {whoPosted && whoPosted.trim() !== "" ? (
              <h2
                onClick={() => handleChat(employerId)}
                className="text-sm sm:text-base font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                💬 {whoPosted}
              </h2>
            ) : (
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">Unknown User</h2>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase">Employer</p>
            <h2 className="text-base sm:text-lg font-bold text-blue-700">{employerName}</h2>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="text-sm sm:text-base text-gray-600 space-y-1 mb-3">
        <p><span className="font-medium">Qualification:</span> {qualification}</p>
        <p><span className="font-medium">Experience:</span> {experiance}</p>
        <p><span className="font-medium">Status:</span> {status}</p>
        <p><span className="font-medium">Address:</span> {address}</p>
        <p><span className="font-medium">Deadline:</span> {new Date(deadline).toLocaleDateString()}</p>
        <p><span className="font-medium">Posted at:</span> {new Date(postedAt).toLocaleDateString()}</p>
      </div>

      {/* Description */}
      <p className="font-medium mt-4">Job Description:</p>
      <p className="text-gray-700 text-sm sm:text-base">
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
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 ${hasApplied ? "border-t pt-4" : ""}`}>
        
        {hasApplied && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
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

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isClosed ? (
            <button
              className="w-full sm:w-auto bg-red-700 text-white px-5 py-2 rounded-lg shadow cursor-not-allowed"
              disabled
            >
              Closed
            </button>
          ) : hasApplied ? (
            <button
              disabled
              className="w-full sm:w-auto bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed shadow"
            >
              ✅ Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
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
