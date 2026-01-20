"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyApplications,
  withdrawApplication,
} from "@/redux/jobs/myApplicationsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import ConfirmModal from "../common/Conformation";

export default function MyApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { myApplications, loading, error, withdrawingId } = useSelector(
    (state: RootState) => state.myApplications
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"applied" | "shortlisted" | "rejected" | "interviews">(
    "applied"
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const appliedJobs = myApplications.filter(
    (app: any) => app.status === "applied"
  );

  const shortlistedJobs = myApplications.filter(
    (app: any) => app.status === "shortlisted"
  );

  const rejectedJobs = myApplications.filter(
    (app: any) => app.status === "rejected"
  );

  const interviews = myApplications.filter(
    (app: any) => app.status === "interview" && app.interview
  );

  const router = useRouter();
  const handleWithdrawClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setConfirmOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (selectedJobId) {
      dispatch(withdrawApplication(selectedJobId));
    }
    setConfirmOpen(false);
    setSelectedJobId(null);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">My Applications</h1>

      {/* Tabs */}
      <div className="flex gap-8 border-b mb-8">
        <button
          onClick={() => setActiveTab("applied")}
          className={`pb-3 text-sm font-medium cursor-pointer ${
            activeTab === "applied"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Applied ({appliedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("shortlisted")}
          className={`pb-3 text-sm font-medium cursor-pointer ${
            activeTab === "shortlisted"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Shortlisted ({shortlistedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`pb-3 text-sm font-medium cursor-pointer ${
            activeTab === "rejected"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Rejected ({rejectedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("interviews")}
          className={`pb-3 text-sm font-medium cursor-pointer ${
            activeTab === "interviews"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Interviews ({interviews.length})
        </button>
      </div>

      {/* Applied Jobs */}
      {activeTab === "applied" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No applications found.
            </p>
          )}

          {appliedJobs.map((app: any) => (
            <div
              key={app._id}
              onClick={() => router.push(`/job/${app.job._id}`)}
              className="cursor-pointer border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {app.job?.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {app.company?.name}
                </p>
                <p className="text-sm text-gray-600">📍 {app.job?.location}</p>
                <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Withdraw Button */}
              {app.status === "applied" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWithdrawClick(app._id); // use app._id, not job._id
                  }}
                  disabled={withdrawingId === app._id} // ✅ disable while loading
                  className={`mt-5 text-sm border px-4 py-2 rounded-lg transition ${
                    withdrawingId === app._id
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  {withdrawingId === app._id ? "Withdrawing..." : "Withdraw"}
                </button>
              )}
            </div>
          ))}
          <ConfirmModal
            open={confirmOpen}
            title="Withdraw application?"
            description="Are you sure you want to withdraw this application? This action cannot be undone."
            confirmText="Withdraw"
            cancelText="Cancel"
            onConfirm={handleConfirmWithdraw}
            onCancel={() => setConfirmOpen(false)}
          />
        </div>
      )}

      {/* Shortlisted Jobs */}
      {activeTab === "shortlisted" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlistedJobs.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No shortlisted applications found.
            </p>
          )}

          {shortlistedJobs.map((app: any) => (
            <div
              key={app._id}
              onClick={() => router.push(`/job/${app.job._id}`)}
              className="cursor-pointer border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {app.job?.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {app.company?.name}
                </p>
                <p className="text-sm text-gray-600">📍 {app.job?.location}</p>
                <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Withdraw Button */}
              {app.status === "shortlisted" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWithdrawClick(app._id);
                  }}
                  disabled={withdrawingId === app._id}
                  className={`mt-5 text-sm border px-4 py-2 rounded-lg transition ${
                    withdrawingId === app._id
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  {withdrawingId === app._id ? "Withdrawing..." : "Withdraw"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejected Jobs */}
      {activeTab === "rejected" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rejectedJobs.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No rejected applications found.
            </p>
          )}

          {rejectedJobs.map((app: any) => (
            <div
              key={app._id}
              onClick={() => router.push(`/job/${app.job._id}`)}
              className="cursor-pointer border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {app.job?.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {app.company?.name}
                </p>
                <p className="text-sm text-gray-600">📍 {app.job?.location}</p>
                <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interviews */}
      {activeTab === "interviews" && (
        <>
          {interviews.length === 0 ? (
            <InterviewEmptyState onBack={() => setActiveTab("applied")} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((app: any) => (
                <InterviewCard key={app._id} app={app} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =======================
   Status Color Helper
======================= */

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'applied':
      return 'bg-blue-50 text-blue-600';
    case 'shortlisted':
      return 'bg-yellow-50 text-yellow-600';
    case 'rejected':
      return 'bg-red-50 text-red-600';
    case 'accepted':
      return 'bg-green-50 text-green-600';
    case 'interview':
      return 'bg-purple-50 text-purple-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
}

/* =======================
   Interview Components
======================= */

function InterviewEmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <span className="text-5xl">📅</span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        No interviews yet
      </h2>

      <p className="text-gray-500 text-sm mb-4">
        Scheduled interviews will appear here.
      </p>

      <button
        onClick={onBack}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        Not seeing an interview?
      </button>
    </div>
  );
}

function InterviewCard({ app }: any) {
  const interview = app.interview;

  if (!interview) return null;

  const interviewDate = new Date(interview.date);
  const today = new Date();
  const isDateOver = interviewDate < today;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white relative">
      {/* Date Over Badge */}
      {isDateOver && (
        <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
          Date Over
        </span>
      )}
      
      <h3 className="font-medium text-gray-900">{app.job?.title}</h3>

      <p className="text-sm text-gray-500 mb-3">{app.company?.name}</p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>📅 {interviewDate.toLocaleDateString()}</p>

        {interview.timeRange && (
          <p>
            ⏰ {interview.timeRange.start} – {interview.timeRange.end}
          </p>
        )}

        <p>
          {interview.medium === "Online"
            ? "💻 Online interview"
            : "🏢 Onsite interview"}
        </p>

        {interview.location && <p>📍 {interview.location}</p>}
      </div>

      {interview.medium === "Online" && interview.meetingLink && (
        <a
          href={interview.meetingLink}
          target="_blank"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          Join meeting
        </a>
      )}
    </div>
  );
}
