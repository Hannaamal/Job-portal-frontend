"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  updateInterviewThunk,
  cancelInterviewThunk,
} from "@/redux/admin/interviewSlice";

type Props = {
  interview: any;
  refresh: () => void;
};

export default function InterviewActions({ interview, refresh }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState<"view" | "edit" | null>(null);
  const [form, setForm] = useState(interview);

  /* CANCEL */
  const cancelInterview = async () => {
    const confirmed = confirm("Are you sure you want to cancel this interview?");
    if (!confirmed) return;

    await dispatch(
      cancelInterviewThunk({ interviewId: interview._id })
    ).unwrap();

    refresh();
  };

  /* UPDATE */
  const updateInterview = async () => {
    await dispatch(
      updateInterviewThunk({
        interviewId: interview._id,
        data: form,
      })
    ).unwrap();

    setMode(null);
    refresh();
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-3">
        <button onClick={() => setMode("view")} className="btn">
          View Details
        </button>
        <button onClick={() => setMode("edit")} className="btn">
          Edit
        </button>
        <button
          onClick={cancelInterview}
          className="btn bg-red-500 text-white"
        >
          Cancel
        </button>
      </div>

      {/* VIEW */}
      {mode === "view" && (
        <div className="border p-4 rounded bg-gray-50">
          <p><b>Type:</b> {interview.interviewType}</p>
          <p><b>Mode:</b> {interview.mode}</p>
          <p><b>Date:</b> {new Date(interview.date).toLocaleString()}</p>
          <p><b>Location:</b> {interview.location || "N/A"}</p>
          <p><b>Meeting:</b> {interview.meetingLink || "N/A"}</p>
        </div>
      )}

      {/* EDIT */}
      {mode === "edit" && (
        <div className="border p-4 rounded space-y-2">
          <input
            type="datetime-local"
            value={form.date?.slice(0, 16)}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
          />

          <input
            placeholder="Meeting Link"
            value={form.meetingLink || ""}
            onChange={(e) =>
              setForm({ ...form, meetingLink: e.target.value })
            }
            className="input"
          />

          <button onClick={updateInterview} className="btn-primary">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
