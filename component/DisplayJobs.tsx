"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadJob from "./LoadJob";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Item {
  employerName: string;
  jobname: string;
  qualification: string;
  experiance: string;
  status: string;
  address: string;
  description: string;
  deadline: Date;
  postedAt: Date;
  createdAt: Date;
  _id: string;
  employerId: string;
}

const DisplayJobs = () => {
  const [formData, setFormData] = useState({ search: "", experiance: "" });
  const [jobData, setJobData] = useState<Item[]>([]);
  const [whoPostedMap, setWhoPostedMap] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const loggedInUserId = session?.user?.id;

  // ✅ Fetch name of employer (user who posted)
  const fetchEmployerName = async (employerId: string) => {
    if (whoPostedMap[employerId]) return; // Already fetched

    try {
      const response = await axios.post("/api/users/fetchEmployerDetail", {
        employerId,
      });
      setWhoPostedMap((prev) => ({
        ...prev,
        [employerId]: response.data.fullName || "Unknown User",
      }));
    } catch (err) {
      console.error("Error fetching employer name:", err);
    }
  };

  // ✅ Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/jobsdisplay");
      const jobs = response.data.savedJobs || [];
      setJobData(jobs);

      // Fetch "who posted" for each job
      jobs.forEach((job: Item) => fetchEmployerName(job.employerId));
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Apply to Job
  const applyJob = async (jobId: string) => {
    const confirmed = window.confirm("Are you sure you want to apply to this job?");
    if (!confirmed) return;

    try {
      await axios.post("/api/applyToJob", { jobId });
      toast.success("Successfully Applied");
    } catch (err) {
      toast.error("Error when applying to Job");
    }
  };

  // ✅ Handle form inputs
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Search Jobs
  const searchJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/searchjob", { keyword: formData.search });
      const jobs = res.data.searchedJob || [];
      setJobData(jobs);
      setError(jobs.length ? "" : "No jobs found.");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ✅ Filter Jobs
  const filterJobs = async () => {
    try {
      const res = await axios.post("/api/filterjob", { experiance: formData.experiance });
      const jobs = res.data.filteredJob || [];
      setJobData(jobs);
      setError(jobs.length ? "" : "No jobs found.");
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  return (
    <div>
      <ToastContainer theme="dark" />

      {/* ✅ Search & Filter */}
      <form
        onSubmit={searchJobs}
        className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white p-4 rounded-xl shadow-md w-full max-w-2xl mx-auto my-6"
      >
        <input
          type="text"
          name="search"
          placeholder="Search jobs..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleFormChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            name="experiance"
            id="filter"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFormChange}
            onClick={filterJobs}
          >
            <option value="">All</option>
            <option value="1-3">1-3</option>
            <option value="4-5">4-5</option>
            <option value="above 5">Above 5</option>
          </select>
        </div>
      </form>

      <p className="text-red-600 text-sm text-center">{error}</p>

      {/* ✅ Render Jobs */}
      {jobData
        .filter((job) => job.employerId !== loggedInUserId)
        .map((job, index) => (
          <LoadJob
            key={job._id}
            id={index}
            _id={job._id}
            mongoId={job._id}
            employerName={job.employerName} // company
            whoPosted={whoPostedMap[job.employerId] || "Loading..."} // ✅ real user name
            jobname={job.jobname}
            qualification={job.qualification}
            experiance={job.experiance}
            status={job.status}
            address={job.address}
            description={job.description}
            deadline={job.deadline}
            employerId = {job.employerId}
            postedAt={job.createdAt}
            applyJob={applyJob}
            
          />
        ))}
    </div>
  );
};

export default DisplayJobs;
