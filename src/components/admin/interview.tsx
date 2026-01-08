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

  const { jobs, loading } = useSelector((state: RootState) => state.adminJobs);
  const { interviews } = useSelector(
    (state: RootState) => state.adminInterviews
  );
  const [viewInterviewId, setViewInterviewId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminJobs());
  }, [dispatch]);

  useEffect(() => {
    jobs.forEach((job) => {
      dispatch(getJobInterviewsThunk({ jobId: job._id }));
    });
  }, [dispatch, jobs]);

  const getInterviewForJob = (jobId: string) => {
    return interviews.find((i) =>
      typeof i.job === "string" ? i.job === jobId : i.job._id === jobId
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Interview Scheduling</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
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

      {/* MODAL */}
      {selectedJobId && (
        <ScheduleInterviewModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
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
