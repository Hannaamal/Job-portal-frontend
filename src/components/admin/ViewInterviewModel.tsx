"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getInterviewByIdThunk } from "@/redux/admin/interviewSlice";

type Props = {
  interviewId: string;
  onClose: () => void;
};

export default function ViewInterviewModal({ interviewId, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const { currentInterview, loading } = useSelector(
    (state: RootState) => state.adminInterviews
  );

  useEffect(() => {
    dispatch(getInterviewByIdThunk({ interviewId }));
  }, [dispatch, interviewId]);

  if (!currentInterview) return null;

  const job =
    typeof currentInterview.job === "string"
      ? null
      : currentInterview.job;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Interview Details
        </h2>

        {/* JOB INFO */}
        <div className="border rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Job</h3>
          <p><b>Title:</b> {job?.title || "N/A"}</p>
        </div>

        {/* INTERVIEW INFO */}
        <div className="space-y-2 text-sm">
          <p><b>Mode:</b> {currentInterview.interviewMode}</p>
          <p><b>Type:</b> {currentInterview.interviewType}</p>
          <p><b>Medium:</b> {currentInterview.medium}</p>
          <p><b>Date:</b> {new Date(currentInterview.date).toLocaleDateString()}</p>

          {currentInterview.timeRange && (
            <p>
              <b>Time:</b>{" "}
              {currentInterview.timeRange.start} -{" "}
              {currentInterview.timeRange.end}
            </p>
          )}

          {currentInterview.medium === "Online" && (
            <p>
              <b>Meeting Link:</b>{" "}
              <a
                href={currentInterview.meetingLink}
                target="_blank"
                className="text-blue-600 underline"
              >
                Join
              </a>
            </p>
          )}

          {currentInterview.medium === "Onsite" && (
            <p>
              <b>Location:</b> {currentInterview.location}
            </p>
          )}

          {currentInterview.instructions && (
            <p>
              <b>Instructions:</b> {currentInterview.instructions}
            </p>
          )}
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
