"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { scheduleInterviewThunk, updateInterviewThunk } from "@/redux/admin/interviewSlice";
import { Application } from "@/redux/admin/applicationSlice";

interface Props {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}

type InterviewForm = {
  date: string;
  interviewType: "Technical" | "HR" | "Managerial";
  mode: "Online" | "Onsite";
  meetingLink: string;
  location: string;
  notes: string;
};

export default function ScheduleInterviewModal({ application, onClose, onSuccess }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState<InterviewForm>({
    date: "",
    interviewType: "Technical",
    mode: "Online",
    meetingLink: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    if (application.interview) {
      setForm({
        date: application.interview.date
          ? new Date(application.interview.date).toISOString().slice(0, 10)
          : "",
        interviewType: application.interview.interviewType,
        mode: application.interview.mode,
        meetingLink: application.interview.meetingLink || "",
        location: application.interview.location || "",
        notes: application.interview.notes || "",
      });
    }
  }, [application.interview]);

  const handleSubmit = async () => {
    try {
      if (application.interview?._id) {
        await dispatch(
          updateInterviewThunk({ interviewId: application.interview._id, data: form })
        ).unwrap();
      } else {
        await dispatch(
          scheduleInterviewThunk({ applicationId: application._id, data: form })
        ).unwrap();
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {application.interview ? "Edit Interview" : "Schedule Interview"}
        </h2>

        <div className="space-y-3">
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <select
            className="w-full border p-2 rounded"
            value={form.interviewType}
            onChange={(e) =>
              setForm({ ...form, interviewType: e.target.value as InterviewForm["interviewType"] })
            }
          >
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Managerial">Managerial</option>
          </select>

          <select
            className="w-full border p-2 rounded"
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as InterviewForm["mode"] })}
          >
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
          </select>

          {form.mode === "Online" ? (
            <input
              type="text"
              placeholder="Meeting link"
              className="w-full border p-2 rounded"
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            />
          ) : (
            <input
              type="text"
              placeholder="Location"
              className="w-full border p-2 rounded"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          )}

          <textarea
            placeholder="Notes (optional)"
            className="w-full border p-2 rounded"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {application.interview ? "Update" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
