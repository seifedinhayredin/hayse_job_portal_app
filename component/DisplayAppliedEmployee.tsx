"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, User, Mail } from "lucide-react";
import Image from "next/image";
import { groupByJob } from "@/utils/groupByJob";

export const DisplayAppliedEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const { data: session } = useSession();

  const loggedInEmployerId = session?.user?.id;

  const fetchJobsForEmployeers = async () => {
    const response = await axios.post("api/displayAppliedJobSeekers");
    setEmployeeData(response.data.applications);
    setHasFetched(true);
  };

  const displayUpdatedStatus = async (applicantId: string, jobId: string) => {
    try {
      const response = await axios.post("api/displayUpdatedStatusOfApplicant", {
        applicantId,
        jobId,
      });

      const key = `${applicantId}_${jobId}`;
      const newStatus = response.data.status || "pending";

      setStatusMap((prev) => ({
        ...prev,
        [key]: newStatus,
      }));
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  };

  const handleStatusChange = async (
    applicantId: string,
    jobId: string,
    jobname:string,
    employerName:string,
    email:string,
    status: "accepted" | "reviewed" | "rejected"
  ) => {
    const confirmed = window.confirm(`Are you sure you want to ${status.slice(0,-2)} application?`)
    if(!confirmed){
      return;
    }
    try {
      await axios.patch("/api/acceptRejectApplication", {
        applicantId,
        jobId,
        status,
      });

      setStatusMap((prev) => ({
        ...prev,
        [`${applicantId}_${jobId}`]: status,
      }));

      sendAcceptanceEmail(email,jobname,employerName,status);

    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    if (employeeData.length > 0) {
      employeeData.forEach((data: any) => {
        displayUpdatedStatus(data.applicant?.applicantId, data.jobId?._id);
      });
    }
  }, [employeeData]);

  const groupedData = groupByJob(employeeData);

  const sendAcceptanceEmail = async (toEmail: string, jobname: string,employerName:string,status:string) => {
            await fetch('/api/sendAcceptanceEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ toEmail, jobname,employerName,status }),
            });
        };
  // ✅ Function to Start Chat
  const handleChat = async (applicantId: string) => {
    try {
      const res = await axios.post("/api/chat/conversations", {
        user1: loggedInEmployerId,
        user2: applicantId,
      });

      const conversation = res.data;
      window.location.href = `/chat/${conversation._id}`; // ✅ Redirect to chat page
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };


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

            {applicants.map((data: any, index: number) => {
              const applicantId = data.applicant?.applicantId;
              const jobId = data.jobId?._id;
              const employerName = data.jobId?.employerName;
              const statusKey = `${applicantId}_${jobId}`;
              const status = statusMap[statusKey];

              return (
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

                  <div className="text-center sm:text-left space-y-2 w-full">
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

                    {/* Show buttons only if status is 'pending' or not yet set */}
                    {(!status || status === "pending") && (
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
                        <button
                          onClick={() =>
                            handleStatusChange(applicantId, jobId,jobname,employerName, data.applicant?.email,"accepted")
                          }
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          ✅ Accept
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(applicantId, jobId,jobname,employerName, data.applicant?.email,"reviewed")
                          }
                          className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        >
                          🔍 Review
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(applicantId, jobId,jobname,employerName,data.applicant?.email, "rejected")
                          }
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          ❌ Reject
                        </button>

                         
                      </div>
                    )}

                    {status && (
                      <div className="text-sm text-blue-600 font-medium pt-3">
                        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    )}
                    {/* ✅ Chat Button */}
                      <button
                        onClick={() => handleChat(applicantId)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        💬 Chat
                      </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};
