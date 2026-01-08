"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyApplications,
  withdrawApplication,
} from "@/redux/jobs/myApplicationsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

export default function MyApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { myApplications, loading, error } = useSelector(
    (state: RootState) => state.myApplications
  );

  const [activeTab, setActiveTab] = useState<"applied" | "interviews">(
    "applied"
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const appliedJobs = myApplications.filter(
    (app: any) => app.status !== "interview"
  );

  const interviews = myApplications.filter(
    (app: any) => app.status === "interview"
  );

  const router = useRouter();
  const handleWithdraw = (jobId: string) => {
    if (confirm("Withdraw this application?")) {
      dispatch(withdrawApplication(jobId));
    }
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
          className={`pb-3 text-sm font-medium ${
            activeTab === "applied"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Applied ({appliedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("interviews")}
          className={`pb-3 text-sm font-medium ${
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
                <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  {app.status}
                </span>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  handleWithdraw(app.job._id);
                }}
                className="mt-5 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-600 transition"
              >
                Withdraw
              </button>
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

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <h3 className="font-medium text-gray-900">
        {app.job?.title}
      </h3>

      <p className="text-sm text-gray-500 mb-3">
        {app.company?.name}
      </p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>📅 {new Date(interview.date).toLocaleDateString()}</p>

        {interview.timeRange && (
          <p>
            ⏰ {interview.timeRange.start} – {interview.timeRange.end}
          </p>
        )}

        <p>
          {interview.medium === "Online" ? "💻 Online interview" : "🏢 Onsite interview"}
        </p>

        {interview.location && <p>📍 {interview.location}</p>}
      </div>

      {interview.meetingLink && (
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
