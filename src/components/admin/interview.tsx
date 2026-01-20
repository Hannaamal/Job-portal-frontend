"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Briefcase, Eye, MapPin, Users, XCircle } from "lucide-react";
import { fetchAdminJobs } from "@/redux/admin/jobPageSlice";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import {
  cancelInterviewThunk,
  getJobInterviewsThunk,
} from "@/redux/admin/interviewSlice";
import ViewInterviewModal from "./ViewInterviewModel";
import ConfirmModal from "../common/Conformation";

export default function AdminInterviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // jobs per page

  const { jobs, loading } = useSelector((state: RootState) => state.adminJobs);

  const { interviews } = useSelector(
    (state: RootState) => state.adminInterviews
  );
  const [viewInterviewId, setViewInterviewId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // For job title search
  const [companyFilter, setCompanyFilter] = useState(""); // For company name filter

  useEffect(() => {
    dispatch(fetchAdminJobs());
  }, [dispatch]);

  useEffect(() => {
    jobs.forEach((job) => {
      console.log("Jobs from Redux:", jobs);
      dispatch(getJobInterviewsThunk({ jobId: job._id }));
    });
  }, [dispatch, jobs]);

  const getInterviewForJob = (jobId: string) => {
    return interviews.find((i) =>
      typeof i.job === "string" ? i.job === jobId : i.job._id === jobId
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCompany = companyFilter
      ? job.company?.name.toLowerCase().includes(companyFilter.toLowerCase())
      : true; // if no filter, show all

    return matchesTitle && matchesCompany;
  });

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const companyOptions = Array.from(
    new Set(
      jobs
        .map((job) => job.company?.name)
        .filter((name): name is string => !!name) // remove null/undefined
    )
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Interview Scheduling</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search job by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Companies</option>
          {companyOptions.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => {
          const interview = getInterviewForJob(job._id);

          return (
            <div
              key={job._id}
              className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 mb-4">
                <Briefcase className="text-blue-600" />
              </div>

              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-500 mt-2">
                {job.company?.name ?? "Unknown Company"}
              </p>

              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <MapPin size={14} />
                {job.location || "Remote"}
              </div>

              {/* ACTIONS */}
              {!interview ? (
                <button
                  onClick={() => setSelectedJobId(job._id)}
                  className="mt-5 w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50"
                >
                  Schedule Interview
                </button>
              ) : (
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setViewInterviewId(interview._id)}
                    className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg font-medium hover:bg-green-50 flex items-center justify-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() => setSelectedJobId(job._id)}
                    className="flex-1 border border-yellow-600 text-yellow-600 py-2 rounded-lg font-medium hover:bg-yellow-50 flex items-center justify-center gap-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmCancelId(interview._id)}
                    className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-1"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filteredJobs.length === 0 && !loading && (
        <p className="col-span-full text-center text-gray-500 mt-6">
          No jobs found.
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-blue-600 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedJobId && (
        <ScheduleInterviewModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onScheduled={() => {
            dispatch(getJobInterviewsThunk({ jobId: selectedJobId }));
          }}
        />
      )}

      {viewInterviewId && (
        <ViewInterviewModal
          interviewId={viewInterviewId}
          onClose={() => setViewInterviewId(null)}
        />
      )}

      <ConfirmModal
        open={!!confirmCancelId}
        title="Cancel Interview?"
        description="This will cancel the interview and revert applicants back to applied status."
        confirmText="Yes, Cancel"
        loading={cancelLoading}
        onCancel={() => setConfirmCancelId(null)}
        onConfirm={async () => {
          if (!confirmCancelId) return;

          setCancelLoading(true);
          try {
            await dispatch(
              cancelInterviewThunk({ interviewId: confirmCancelId })
            ).unwrap();

            

            alert("Interview cancelled successfully");
            setConfirmCancelId(null);
          } catch (err: any) {
            alert(err || "Failed to cancel interview");
          } finally {
            setCancelLoading(false);
          }
        }}
      />

      {loading && (
        <p className="text-center text-gray-500 mt-6">Loading jobs...</p>
      )}
    </div>
  );
}
